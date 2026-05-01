import React from 'react';
import { CheckCircleIcon } from '@/constants/icons/AuthIcons';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    label: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: React.ReactNode;
    success?: React.ReactNode;
    ref?: React.RefObject<HTMLInputElement>;
    containerClassName?: string;
    labelRight?: React.ReactNode;
    inputStyle?: React.CSSProperties;
    hideLabel?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    icon,
    rightIcon,
    ref,
    error,
    success,
    containerClassName = '',
    labelRight,
    inputStyle,
    hideLabel,
    className = '',
    ...props
}) => {
    return (
        <div className={containerClassName}>
            {!hideLabel && (
                <div className={`flex items-end justify-between ${labelRight ? 'mb-3' : 'mb-3'}`}>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">
                        {label}
                    </label>
                    {labelRight && labelRight}
                </div>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    style={inputStyle}
                    ref={ref}
                    suppressHydrationWarning={true}
                    className={`block w-full py-3.5 border rounded-[10px] bg-[#f7f8f9] text-[0.95rem] transition-colors outline-none font-medium text-gray-800 ${error
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : success
                            ? 'border-[#10b981] focus:ring-[#10b981] focus:border-[#10b981] bg-[#f0fdf4]'
                            : 'border-gray-200 focus:ring-[#5b51e0] focus:border-[#5b51e0]'
                        } ${icon ? 'pl-11' : 'pl-3'} ${rightIcon || (success && !icon) ? 'pr-12' : 'pr-3'} ${className}`}
                />
                {success && !rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#10b981]">
                        <CheckCircleIcon size={20} />
                    </div>
                )}
                {rightIcon && (
                    <div className="absolute  top-2 inset-y-0 right-0 pr-3.5 flex items-center">
                        {rightIcon}
                    </div>
                )}
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
