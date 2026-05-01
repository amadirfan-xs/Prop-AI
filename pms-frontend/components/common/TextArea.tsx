import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: React.ReactNode;
  success?: React.ReactNode;
  containerClassName?: string;
  labelRight?: React.ReactNode;
  hideLabel?: boolean;
  readonly?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  success,
  containerClassName = "",
  labelRight,
  hideLabel,
  readonly,
  className = "",
  rows = 4,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {!hideLabel && (
        <div className="flex items-end justify-between mb-3">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">
            {label}
          </label>
          {labelRight && labelRight}
        </div>
      )}
      <div className="relative">
        <textarea
          {...props}
          rows={rows}
          readOnly={readonly}
          className={`block w-full py-3.5 px-4 border text-gray-400 rounded-[10px] text-[0.95rem] transition-all outline-none font-medium resize-none ${
            readonly
              ? "bg-transparent border-transparent px-0 cursor-default text-gray-900"
              : error
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-[#f7f8f9]"
                : success
                  ? "border-[#10b981] focus:ring-[#10b981] bg-[#f0fdf4]"
                  : "border-gray-200 focus:ring-[#5b51e0] focus:border-[#5b51e0] bg-[#f7f8f9]"
          } ${className}`}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-[#d32f2f] flex items-center gap-1 font-semibold">
          {error}
        </p>
      )}
      {success && !error && (
        <p className="mt-2 text-xs text-[#10b981] flex items-center gap-1 font-semibold">
          {success}
        </p>
      )}
    </div>
  );
};
