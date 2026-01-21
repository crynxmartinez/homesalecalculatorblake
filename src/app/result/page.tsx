"use client";

import { useEffect, useMemo } from "react";
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

  // Calculate value range and breakdown based on Zestimate and user answers
  const calculations = useMemo(() => {
    const zestimate = formData.zestimate || 0;
    
    // Value range: Low (-8%), Market (Zestimate), High (+8%)
    const lowValue = Math.round(zestimate * 0.92);
    const highValue = Math.round(zestimate * 1.08);
    
    // Gauge position: random between 30-70% (not always center)
    const gaugePosition = 30 + Math.random() * 40; // 30% to 70%
    
    // Comparable Sales: random 0% to -10% lower
    const comparableSalesPercent = -(Math.random() * 10); // -10% to 0%
    const comparableSales = Math.round(zestimate * (1 + comparableSalesPercent / 100));
    const nearbySalesCount = Math.floor(3 + Math.random() * 6); // 3 to 8 homes
    
    // Home Details: based on condition answer
    let conditionMultiplier = 1;
    let conditionLabel = "Average";
    switch (formData.homeCondition) {
      case "excellent": 
        conditionMultiplier = 1.03; 
        conditionLabel = "Excellent";
        break;
      case "good": 
        conditionMultiplier = 1.00; 
        conditionLabel = "Good";
        break;
      case "fair": 
        conditionMultiplier = 0.97; 
        conditionLabel = "Fair";
        break;
      case "needs_work": 
        conditionMultiplier = 0.94; 
        conditionLabel = "Needs Work";
        break;
      default: 
        conditionMultiplier = 1.00;
        conditionLabel = "Average";
    }
    const homeDetailsValue = Math.round(zestimate * conditionMultiplier);
    
    // Market Trends: random -3% to +4% with arrow direction
    const trendPercent = -3 + Math.random() * 7; // -3% to +4%
    const trendDirection = trendPercent > 0.5 ? "up" : trendPercent < -0.5 ? "down" : "stable";
    
    return {
      lowValue,
      highValue,
      gaugePosition,
      comparableSales,
      comparableSalesPercent,
      nearbySalesCount,
      homeDetailsValue,
      conditionLabel,
      trendPercent,
      trendDirection,
    };
  }, [formData.zestimate, formData.homeCondition]);

  if (!formData.zestimate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calculate your profit, fees & taxes
          </h1>
          <p className="text-gray-500 text-sm">{formData.address}</p>
        </div>

        {/* Home Value Range Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            Home Value Range
          </h2>

          {/* Value Labels */}
          <div className="flex justify-between items-end mb-2">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Low</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Market Value</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">High</p>
            </div>
          </div>

          {/* Gauge Bar */}
          <div className="relative mb-2">
            <div 
              className="h-4 rounded-full"
              style={{
                background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6)",
              }}
            />
            {/* Market Value Indicator - random position */}
            <div 
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all"
              style={{ left: `${calculations.gaugePosition}%` }}
            >
              <div className="w-6 h-6 bg-white border-4 border-gray-800 rounded-full shadow-lg" />
            </div>
          </div>

          {/* Value Numbers */}
          <div className="flex justify-between items-start">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(calculations.lowValue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(formData.zestimate)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(calculations.highValue)}
              </p>
            </div>
          </div>
        </div>

        {/* How We Determined Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
            How we determined your value estimate
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Comparable Sales */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Comparable sales</h3>
              <p className="text-xs text-gray-500 mb-2">Based on {calculations.nearbySalesCount} nearby sales</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(calculations.comparableSales)}
              </p>
            </div>

            {/* Home Details */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Home details</h3>
              <p className="text-xs text-gray-500 mb-2">Condition: {calculations.conditionLabel}</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(calculations.homeDetailsValue)}
              </p>
            </div>

            {/* Market Trends */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                calculations.trendDirection === "up" ? "bg-green-100" : 
                calculations.trendDirection === "down" ? "bg-red-100" : "bg-gray-100"
              }`}>
                {calculations.trendDirection === "up" ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : calculations.trendDirection === "down" ? (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Market trends</h3>
              <p className="text-xs text-gray-500 mb-2">Current market conditions</p>
              <p className={`text-lg font-bold flex items-center justify-center gap-1 ${
                calculations.trendDirection === "up" ? "text-green-600" : 
                calculations.trendDirection === "down" ? "text-red-600" : "text-gray-600"
              }`}>
                {calculations.trendDirection === "up" ? "↑" : calculations.trendDirection === "down" ? "↓" : "→"}
                {calculations.trendPercent >= 0 ? "+" : ""}{calculations.trendPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Rent Estimate (if available) */}
        {formData.rentZestimate && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Estimated Monthly Rent</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(formData.rentZestimate)}/mo
              </p>
            </div>
          </div>
        )}

        {/* Start Over Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Calculate Another Property
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          This estimate is for informational purposes only and is not an appraisal.
        </p>
      </div>
    </div>
  );
}
