"use client";

import { useFormContext } from "@/context/FormContext";
import QuestionCard from "@/components/QuestionCard";

const options = [
  { value: "mortgage", label: "I have a mortgage" },
  { value: "paid_off", label: "My home is paid off" },
  { value: "not_sure", label: "I'm not sure" },
];

export default function MortgageQuestion() {
  const { formData, updateFormData } = useFormContext();

  return (
    <QuestionCard
      question="Do you still owe anything on your home?"
      options={options}
      selectedValue={formData.mortgageStatus}
      onSelect={(value) => updateFormData("mortgageStatus", value)}
      nextPath="/questions/condition"
      prevPath="/questions/owner"
      showBack={true}
    />
  );
}
