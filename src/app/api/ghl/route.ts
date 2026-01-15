import { NextRequest, NextResponse } from "next/server";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_URL = "https://services.leadconnectorhq.com/contacts/";

interface ContactData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address1?: string;
  customFields?: Array<{ key: string; field_value: string }>;
  tags?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, contactId, ...data } = body;

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error("Missing GHL credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create new contact
    if (action === "create") {
      const contactData: ContactData = {
        firstName: data.firstName || "Lead",
        lastName: data.lastName || "HomeSaleCalculator",
        email: data.email || `lead-${Date.now()}@homesalecalculator.temp`,
        address1: data.address,
        tags: ["Home Sale Calculator"],
      };

      const response = await fetch(GHL_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactData,
          locationId: GHL_LOCATION_ID,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("GHL create error:", result);
        return NextResponse.json(
          { error: "Failed to create contact", details: result },
          { status: response.status }
        );
      }

      return NextResponse.json({ 
        success: true, 
        contactId: result.contact?.id 
      });
    }

    // Update existing contact
    if (action === "update" && contactId) {
      const customFields: Array<{ key: string; field_value: string }> = [];
      
      if (data.zestimate) {
        customFields.push({
          key: "home_sale_calculator_zestimate",
          field_value: data.zestimate,
        });
      }

      const updateData: ContactData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof ContactData] === undefined) {
          delete updateData[key as keyof ContactData];
        }
      });

      if (customFields.length > 0) {
        updateData.customFields = customFields;
      }

      const response = await fetch(`${GHL_API_URL}${contactId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("GHL update error:", result);
        return NextResponse.json(
          { error: "Failed to update contact", details: result },
          { status: response.status }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("GHL API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
