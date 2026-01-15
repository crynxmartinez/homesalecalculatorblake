"use client";

import { useRouter } from "next/navigation";

interface Option {
  value: string;
  label: string;
}

interface QuestionCardProps {
  question: string;
  subtitle?: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  nextPath: string;
  prevPath?: string;
  showBack?: boolean;
}

export default function QuestionCard({
  question,
  subtitle,
  options,
  selectedValue,
  onSelect,
  nextPath,
  prevPath,
  showBack = true,
}: QuestionCardProps) {
  const router = useRouter();

  const handleSelect = (value: string) => {
    onSelect(value);
    setTimeout(() => {
      router.push(nextPath);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-xl mx-auto w-full">
        {showBack && prevPath && (
          <button
            onClick={() => router.push(prevPath)}
            className="self-start mb-8 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {question}
        </h1>
        
        {subtitle && (
          <p className="text-gray-500 mb-8">{subtitle}</p>
        )}

        <div className="space-y-3 mt-6">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
                selectedValue === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-gray-700">{option.label}</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedValue === option.value
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedValue === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
