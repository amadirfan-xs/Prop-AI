import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', id, ...props }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative flex items-center justify-center w-5 h-5">
                <input
                    type="checkbox"
                    id={id}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-[#5b51e0] checked:border-[#5b51e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b51e0] cursor-pointer transition-colors"
                    {...props}
                />
                <svg
                    className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <path d="M5 13l4 4L19 7" />
                </svg>
            </div>
            {label && (
                <label htmlFor={id} className="text-[13px] text-gray-600 font-medium cursor-pointer select-none">
                    {label}
                </label>
            )}
        </div>
    );
};
