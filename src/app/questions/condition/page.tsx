"use client";

import { useFormContext } from "@/context/FormContext";
import QuestionCard from "@/components/QuestionCard";

const options = [
  { value: "nothing", label: "Needs nothing" },
  { value: "little_work", label: "Needs a little work" },
  { value: "major_work", label: "Needs major work" },
  { value: "tear_down", label: "Tear down" },
];

export default function ConditionQuestion() {
  const { formData, updateFormData } = useFormContext();

  return (
    <QuestionCard
      question="What is the condition of your home?"
      options={options}
      selectedValue={formData.homeCondition}
      onSelect={(value) => updateFormData("homeCondition", value)}
      nextPath="/questions/timeline"
      prevPath="/questions/mortgage"
      showBack={true}
    />
  );
}
