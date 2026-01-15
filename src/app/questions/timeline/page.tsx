"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";

const options = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3_months", label: "1-3 months" },
  { value: "3-6_months", label: "3-6 months" },
  { value: "6-12_months", label: "6-12+ months" },
  { value: "no_plans", label: "No plans to sell" },
];

export default function TimelineQuestion() {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (value: string) => {
    updateFormData("sellTimeline", value);
    setIsLoading(true);

    // Fetch Zestimate before going to contact page
    try {
      const response = await fetch(
        `https://zillow-zestimate.p.rapidapi.com/zestimate?address=${encodeURIComponent(
          formData.address
        )}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "zillow-zestimate.p.rapidapi.com",
            "x-rapidapi-key": "047a4435bamsh9b85f291b0421d6p130f1cjsn2b6a05a025b0",
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("Zestimate response:", data);
        
        if (data.zestimate) {
          updateFormData("zestimate", data.zestimate);
        }
        if (data.rentZestimate || data.rent_zestimate) {
          updateFormData("rentZestimate", data.rentZestimate || data.rent_zestimate);
        }
      } else {
        console.error("Zestimate API error:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch zestimate:", error);
    }

    router.push("/contact");
  };

  const handleBack = () => {
    router.push("/questions/condition");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          How soon would you consider selling?
        </h2>
        <p className="text-gray-500 text-center mb-6">
          We&apos;ll show when you could walk away with the most.
        </p>

        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={isLoading}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                formData.sellTimeline === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-gray-900 font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Calculating your home value...</p>
          </div>
        )}

        <button
          onClick={handleBack}
          disabled={isLoading}
          className="mt-6 w-full py-3 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
