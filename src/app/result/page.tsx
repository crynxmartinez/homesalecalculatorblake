"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormContext } from "@/context/FormContext";

export default function ResultPage() {
  const router = useRouter();
  const { formData } = useFormContext();

  useEffect(() => {
    if (!formData.address) {
      router.push("/");
      return;
    }
  }, [formData.address, router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!formData.zestimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">Unable to find an estimate for this address. Please try a different address.</p>
          <Link
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Try Another Address
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Home Value Estimate
          </h1>
          <p className="text-gray-500 text-sm">{formData.address}</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-center mb-6">
          <p className="text-blue-100 text-sm mb-1">Estimated Value</p>
          <p className="text-4xl font-bold text-white">
            {formData.zestimate ? formatCurrency(formData.zestimate) : "N/A"}
          </p>
        </div>

        {formData.rentZestimate && (
          <div className="bg-gray-50 rounded-xl p-4 text-center mb-6">
            <p className="text-gray-500 text-sm mb-1">Rent Estimate</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(formData.rentZestimate)}/mo
            </p>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Your Responses</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Owner Status:</span>
              <span className="text-gray-900 capitalize">
                {formData.isOwner === "yes" ? "Yes, I am the owner" : "Not the owner"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mortgage:</span>
              <span className="text-gray-900 capitalize">
                {formData.mortgageStatus?.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Condition:</span>
              <span className="text-gray-900 capitalize">
                {formData.homeCondition?.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Timeline:</span>
              <span className="text-gray-900 capitalize">
                {formData.sellTimeline?.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="flex-1 text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Start Over
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          This estimate is for informational purposes only and is not an appraisal.
        </p>
      </div>
    </div>
  );
}
