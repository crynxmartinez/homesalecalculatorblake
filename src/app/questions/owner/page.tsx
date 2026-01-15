"use client";

import { useFormContext } from "@/context/FormContext";
import QuestionCard from "@/components/QuestionCard";

const options = [
  { value: "yes", label: "Yes, I am" },
  { value: "no", label: "No, I am not" },
];

export default function OwnerQuestion() {
  const { formData, updateFormData } = useFormContext();

  return (
    <QuestionCard
      question="Are you the owner of this home?"
      options={options}
      selectedValue={formData.isOwner}
      onSelect={(value) => updateFormData("isOwner", value)}
      nextPath="/questions/mortgage"
      prevPath="/"
      showBack={true}
    />
  );
}
