"use client";

import React from "react";
import PhoneInput from "react-phone-number-input";
import { useField, useFormikContext } from "formik";

interface PhoneInputProps {
  label: string;
  name: string;
  placeholder?: string;
  containerClassName?: string;
}

export const PhoneInputComponent: React.FC<PhoneInputProps> = ({
  label,
  name,
  placeholder,
  containerClassName = "",
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const handleChange = (value?: string) => {
    setFieldValue(name, value || "");
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  const hasError = meta.touched && meta.error;

  return (
    <div className={containerClassName}>
      <div className="flex items-end justify-between mb-3">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">
          {label}
        </label>
      </div>
      <div className="relative phone-input-container">
        <PhoneInput
          {...field}
          placeholder={placeholder}
          value={field.value}
          defaultCountry="US"
          country="US"
          countries={["US"]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`block w-full py-2.5 border rounded-[10px] bg-[#f7f8f9] text-[0.95rem] transition-colors outline-none font-medium text-gray-800 ${
            hasError
              ? "border-red-300 ring-red-500 border-red-500"
              : "border-gray-200 focus-within:ring-[#5b51e0] focus-within:border-[#5b51e0]"
          }`}
        />
      </div>
      {hasError && (
        <p className="mt-2 text-xs text-[#d32f2f] flex items-center gap-[4px] font-semibold">
          {meta.error}
        </p>
      )}

      <style jsx global>{`
        .phone-input-container .PhoneInput {
          display: flex;
          align-items: center;
          padding: 0 0.875rem;
        }
        .phone-input-container .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.5rem 0;
          margin-left: 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1f2937;
        }
        .phone-input-container .PhoneInputCountrySelectArrow {
          margin-left: 0.35rem;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};
