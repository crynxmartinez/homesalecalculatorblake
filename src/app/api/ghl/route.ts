import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// GHL API v2 base URL for Private Integration Tokens
const GHL_API_URL = "https://services.leadconnectorhq.com";
const GHL_UPSERT_URL = `${GHL_API_URL}/contacts/upsert`;

// Generate deterministic placeholder email from address
// Same address = same email = can update the same contact
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

    // Create/upsert contact using GHL API v2 upsert endpoint
    if (action === "create") {
      // Use deterministic placeholder email based on address hash
      // This allows us to update the same contact later
      const placeholderEmail = data.address 
        ? generatePlaceholderEmail(data.address) 
        : `lead${Date.now()}@homesalecalculator.temp`;
      
      const contactPayload = {
        locationId: GHL_LOCATION_ID,
        firstName: data.firstName || "Lead",
        lastName: data.lastName || "HomeSaleCalculator",
        email: placeholderEmail,
        address1: data.address || "",
        tags: ["Home Sale Calculator", "Partial Lead"],
      };
      
      console.log("Placeholder email for address:", placeholderEmail);

      console.log("Upserting GHL contact with payload:", JSON.stringify(contactPayload));

      const response = await fetch(GHL_UPSERT_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactPayload),
      });

      const responseText = await response.text();
      console.log("GHL upsert response:", response.status, responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { raw: responseText };
      }
      
      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to upsert contact", details: result, success: false },
          { status: response.status }
        );
      }

      return NextResponse.json({ 
        success: true, 
        contactId: result.contact?.id || result.id
      });
    }

    // Update existing contact using two-step upsert approach
    // Step 1: Match by placeholder email, add name/phone
    // Step 2: Match by phone, replace placeholder email with real email
    if (action === "update") {
      if (!data.address) {
        return NextResponse.json(
          { error: "Address required for update", success: false },
          { status: 400 }
        );
      }
      
      const placeholderEmail = generatePlaceholderEmail(data.address);
      console.log("Update - using placeholder email:", placeholderEmail);
      
      // Step 1: Update partial lead (matched by placeholder email) with name, phone
      const step1Payload: Record<string, unknown> = {
        locationId: GHL_LOCATION_ID,
        email: placeholderEmail,
        address1: data.address,
        tags: ["Home Sale Calculator", "Lead Complete"],
      };
      
      if (data.firstName) step1Payload.firstName = data.firstName;
      if (data.lastName) step1Payload.lastName = data.lastName;
      if (data.phone) step1Payload.phone = data.phone;
      
      // Add zestimate as custom field
      if (data.zestimate) {
        step1Payload.customFields = [
          {
            id: "home_sale_calculator_zestimate",
            field_value: data.zestimate,
          }
        ];
      }

      console.log("Step 1 - Updating with name/phone:", JSON.stringify(step1Payload));

      const response1 = await fetch(GHL_UPSERT_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(step1Payload),
      });

      const responseText1 = await response1.text();
      console.log("Step 1 response:", response1.status, responseText1);
      
      // Step 2: If user provided real email, update by phone to replace placeholder email
      if (data.email && data.phone) {
        const step2Payload = {
          locationId: GHL_LOCATION_ID,
          phone: data.phone,
          email: data.email,
          tags: ["Home Sale Calculator", "Lead Complete"],
        };
        
        console.log("Step 2 - Replacing placeholder email with real email:", JSON.stringify(step2Payload));
        
        const response2 = await fetch(GHL_UPSERT_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(step2Payload),
        });
        
        const responseText2 = await response2.text();
        console.log("Step 2 response:", response2.status, responseText2);
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
