"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormData {
  address: string;
  isOwner: string;
  mortgageStatus: string;
  homeCondition: string;
  sellTimeline: string;
  zestimate: number | null;
  rentZestimate: number | null;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string | number | null) => void;
  resetForm: () => void;
}

const initialFormData: FormData = {
  address: "",
  isOwner: "",
  mortgageStatus: "",
  homeCondition: "",
  sellTimeline: "",
  zestimate: null,
  rentZestimate: null,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (field: keyof FormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
