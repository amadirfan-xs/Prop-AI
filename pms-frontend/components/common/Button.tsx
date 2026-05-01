"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading, disabled, variant = 'primary', className = '', ...props }) => {
    const variantStyles = {
        primary: 'text-white bg-[#3525CD] hover:bg-[#493ebf] active:bg-[#3d33a6]',
        secondary: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-transparent',
        danger: 'text-white bg-red-600 hover:bg-red-700 active:bg-red-800'
    };

    return (
        <button
            disabled={isLoading || disabled}
            className={`flex justify-center cursor-pointer py-3 px-4 border rounded-[10px] shadow-sm text-sm font-bold transition-colors items-center gap-2 ${variantStyles[variant]} ${className}`}
            {...props}
        >
            <div className="flex items-center gap-2">
                {isLoading && (
                    <svg className="animate-spin -ml-1 h-4 w-4 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </div>
        </button>
    );
};
