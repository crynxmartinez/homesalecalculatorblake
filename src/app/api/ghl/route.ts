import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// GHL API v2 base URL for Private Integration Tokens
const GHL_API_URL = "https://services.leadconnectorhq.com";
const GHL_UPSERT_URL = `${GHL_API_URL}/contacts/upsert`;

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
      const contactPayload = {
        locationId: GHL_LOCATION_ID,
        firstName: data.firstName || "Lead",
        lastName: data.lastName || "HomeSaleCalculator",
        email: data.email || `lead${Date.now()}@homesalecalculator.temp`,
        address1: data.address || "",
        tags: ["Home Sale Calculator"],
      };

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

    // Update existing contact using upsert (matched by phone or email)
    if (action === "update") {
      const updatePayload: Record<string, unknown> = {
        locationId: GHL_LOCATION_ID,
      };
      
      if (data.firstName) updatePayload.firstName = data.firstName;
      if (data.lastName) updatePayload.lastName = data.lastName;
      if (data.name) updatePayload.name = data.name;
      if (data.email) updatePayload.email = data.email;
      if (data.phone) updatePayload.phone = data.phone;
      if (data.address) updatePayload.address1 = data.address;
      
      // Add zestimate as custom field
      if (data.zestimate) {
        updatePayload.customFields = [
          {
            id: "home_sale_calculator_zestimate",
            field_value: data.zestimate,
          }
        ];
      }
      
      // Add tags
      updatePayload.tags = ["Home Sale Calculator", "Lead Complete"];

      console.log("Upserting GHL contact (update):", JSON.stringify(updatePayload));

      const response = await fetch(GHL_UPSERT_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const responseText = await response.text();
      console.log("GHL update response:", response.status, responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { raw: responseText };
      }

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to update contact", details: result, success: false },
          { status: response.status }
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
