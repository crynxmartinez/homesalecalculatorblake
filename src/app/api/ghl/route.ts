import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// GHL API v2 base URL for Private Integration Tokens
const GHL_API_URL = "https://services.leadconnectorhq.com";
const GHL_UPSERT_URL = `${GHL_API_URL}/contacts/upsert`;

// Generate deterministic placeholder email from address for partial leads
function hashAddress(address: string): number {
  const normalized = address.toLowerCase().trim().replace(/\s+/g, " ");
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generatePlaceholderEmail(address: string): string {
  const hash = hashAddress(address);
  return `partial_${hash}@placeholder.lead`;
}

// Helper to make GHL API call
async function upsertContact(payload: Record<string, unknown>) {
  const response = await fetch(GHL_UPSERT_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GHL_API_KEY}`,
      "Version": "2021-07-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log("GHL upsert response:", response.status, responseText);

  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    result = { raw: responseText };
  }

  return { ok: response.ok, status: response.status, result };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, contactId, ...data } = body;

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error("Missing GHL credentials - API_KEY:", !!GHL_API_KEY, "LOCATION_ID:", !!GHL_LOCATION_ID);
      return NextResponse.json(
        { error: "Server configuration error", success: false },
        { status: 500 }
      );
    }

    // Log first 10 chars of API key for debugging (safe to log partial)
    console.log("GHL API Key starts with:", GHL_API_KEY.substring(0, 10));
    console.log("GHL Location ID:", GHL_LOCATION_ID);

    // ACTION: CREATE - Partial Lead (address only)
    // Called when user enters address on home page
    if (action === "create") {
      const placeholderEmail = data.address 
        ? generatePlaceholderEmail(data.address) 
        : `lead${Date.now()}@homesalecalculator.temp`;
      
      const payload = {
        locationId: GHL_LOCATION_ID,
        firstName: "Lead",
        lastName: "HomeSaleCalculator",
        email: placeholderEmail,
        address1: data.address || "",
        tags: ["Home Sale Calculator", "Partial Lead"],
      };
      
      console.log("Creating PARTIAL LEAD:", JSON.stringify(payload));

      const { ok, status, result } = await upsertContact(payload);
      
      if (!ok) {
        return NextResponse.json(
          { error: "Failed to create partial lead", details: result, success: false },
          { status }
        );
      }

      return NextResponse.json({ 
        success: true, 
        contactId: result.contact?.id || result.id
      });
    }

    // ACTION: COMPLETE - Full Lead (all info)
    // Called when user completes contact form with name/phone/email
    if (action === "complete") {
      // Validate required fields
      if (!data.firstName) {
        return NextResponse.json(
          { error: "First name required", success: false },
          { status: 400 }
        );
      }

      const payload: Record<string, unknown> = {
        locationId: GHL_LOCATION_ID,
        firstName: data.firstName,
        lastName: data.lastName || "",
        address1: data.address || "",
        tags: ["Home Sale Calculator", "Full Lead"],
      };
      
      // Use real email if provided, otherwise generate unique one
      if (data.email) {
        payload.email = data.email;
      } else {
        payload.email = `lead_${Date.now()}@homesalecalculator.noemail`;
      }
      
      // Add phone if provided
      if (data.phone) {
        payload.phone = data.phone;
      }
      
      // Add zestimate as custom field
      if (data.zestimate) {
        payload.customFields = [
          {
            id: "home_sale_calculator_zestimate",
            field_value: data.zestimate,
          }
        ];
      }

      console.log("Creating FULL LEAD:", JSON.stringify(payload));

      const { ok, status, result } = await upsertContact(payload);
      
      if (!ok) {
        return NextResponse.json(
          { error: "Failed to create full lead", details: result, success: false },
          { status }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action", success: false },
      { status: 400 }
    );
  } catch (error) {
    console.error("GHL API error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
