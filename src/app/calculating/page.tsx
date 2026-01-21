"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";

const loadingSteps = [
  { icon: "🏠", text: "Analyzing your property..." },
  { icon: "📊", text: "Comparing nearby sales..." },
  { icon: "📈", text: "Evaluating market trends..." },
  { icon: "🧮", text: "Calculating your home value..." },
];

export default function CalculatingPage() {
  const router = useRouter();
  const { formData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If no zestimate, redirect back
    if (!formData.zestimate) {
      router.push("/");
      return;
    }

    // Cycle through loading steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 800);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 60);

    // Redirect to results after 3.5 seconds
    const redirectTimeout = setTimeout(() => {
      router.push("/result");
    }, 3500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [formData.zestimate, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Animated House Icon */}
        <div className="mb-6">
          <div className="text-6xl animate-bounce">
            {loadingSteps[currentStep].icon}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Calculating Your Home Value
        </h1>

        {/* Address */}
        <p className="text-gray-500 text-sm mb-6 truncate">
          {formData.address}
        </p>

        {/* Loading Text */}
        <p className="text-lg text-blue-600 font-medium mb-6 h-7">
          {loadingSteps[currentStep].text}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
            }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-gray-400 text-sm">{progress}% complete</p>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
