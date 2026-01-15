"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import AddressInput from "@/components/AddressInput";

export default function Home() {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();

  const handleSubmit = async () => {
    if (formData.address) {
      // Send address to GHL with pseudo contact
      console.log("📤 Sending address to GHL:", formData.address);
      try {
        const response = await fetch("/api/ghl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            address: formData.address,
            firstName: "Lead",
            lastName: "HomeSaleCalculator",
          }),
        });
        const data = await response.json();
        console.log("📥 GHL response:", data);
        if (data.contactId) {
          console.log("✅ GHL contact created:", data.contactId);
          updateFormData("ghlContactId", data.contactId);
        }
      } catch (error) {
        console.error("❌ Failed to create GHL contact:", error);
      }
      
      router.push("/questions/owner");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/686e8e85aa75afc73d3a59ab/686e8e85aa75afc73d3a5aae_HOMEEEE.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="https://cdn.prod.website-files.com/686e8e85aa75afc73d3a59ab/686e8e85aa75afc73d3a5a90_20%25.png"
            alt="Home Sale Calculator Logo"
            width={80}
            height={80}
            className="mx-auto"
            unoptimized
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2 italic">
          Home Sale Calculator
        </h1>
        <p className="text-xl text-white text-center mb-8">
          Just enter your address
        </p>

        {/* Address Input */}
        <div className="w-full max-w-xl">
          <AddressInput
            value={formData.address}
            onChange={(value) => updateFormData("address", value)}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Subtitle */}
        <p className="text-white text-center mt-6 text-lg">
          Get a quick breakdown of your profit, fees, and taxes
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <div className="flex items-center justify-center gap-4 text-white text-sm">
          <Link href="/terms" className="hover:underline">
            Terms and Conditions
          </Link>
          <span>|</span>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
