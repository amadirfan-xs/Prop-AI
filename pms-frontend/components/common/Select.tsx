import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    containerClassName?: string;
    error?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    containerClassName = '',
    className = '',
    error,
    ...props
}) => {
    return (
        <div className={containerClassName}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {label}
            </label>
            <div className="relative group">
                <select
                    {...props}
                    className={`block w-full py-3.5 pl-4 pr-10 border border-gray-200 rounded-[10px] bg-[#f7f8f9] text-[0.95rem] font-medium text-gray-800 transition-all outline-none focus:bg-white focus:border-[#3525CD] appearance-none cursor-pointer ${className}`}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3525CD]">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
            </div>
            {error && (
                <p className="mt-2 text-[13px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                    {error}
                </p>
            )}
        </div>
    );
};
