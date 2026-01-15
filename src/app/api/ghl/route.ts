import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

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

    // Create new contact using GHL API v1 (simpler format)
    if (action === "create") {
      const contactPayload = {
        firstName: data.firstName || "Lead",
        lastName: data.lastName || "HomeSaleCalculator",
        email: data.email || `lead-${Date.now()}@homesalecalculator.temp`,
        address1: data.address,
        tags: ["Home Sale Calculator"],
        source: "Home Sale Calculator",
      };

      console.log("Creating GHL contact:", contactPayload);

      const response = await fetch(
        `https://rest.gohighlevel.com/v1/contacts/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactPayload),
        }
      );

      const result = await response.json();
      console.log("GHL create response:", response.status, result);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to create contact", details: result, success: false },
          { status: response.status }
        );
      }

      return NextResponse.json({ 
        success: true, 
        contactId: result.contact?.id || result.id
      });
    }

    // Update existing contact
    if (action === "update" && contactId) {
      const updatePayload: Record<string, unknown> = {};
      
      if (data.firstName) updatePayload.firstName = data.firstName;
      if (data.lastName) updatePayload.lastName = data.lastName;
      if (data.email) updatePayload.email = data.email;
      if (data.phone) updatePayload.phone = data.phone;
      
      // Add zestimate as custom field
      if (data.zestimate) {
        updatePayload.customField = {
          home_sale_calculator_zestimate: data.zestimate,
        };
      }

      console.log("Updating GHL contact:", contactId, updatePayload);

      const response = await fetch(
        `https://rest.gohighlevel.com/v1/contacts/${contactId}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${GHL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      const result = await response.json();
      console.log("GHL update response:", response.status, result);

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
