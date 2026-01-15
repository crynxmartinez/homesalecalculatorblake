"use client";

import { useFormContext } from "@/context/FormContext";
import QuestionCard from "@/components/QuestionCard";

const options = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3_months", label: "1-3 months" },
  { value: "3-6_months", label: "3-6 months" },
  { value: "6-12_months", label: "6-12+ months" },
  { value: "no_plans", label: "No plans to sell" },
];

export default function TimelineQuestion() {
  const { formData, updateFormData } = useFormContext();

  return (
    <QuestionCard
      question="How soon would you consider selling?"
      subtitle="We'll show when you could walk away with the most."
      options={options}
      selectedValue={formData.sellTimeline}
      onSelect={(value) => updateFormData("sellTimeline", value)}
      nextPath="/result"
      prevPath="/questions/condition"
      showBack={true}
    />
  );
}
