"use client";

import React from 'react';

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const TextButton: React.FC<TextButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    ...props
}) => {
    const variants = {
        primary: 'text-[#3525CD] hover:text-[#493ebf]',
        secondary: 'text-gray-500 hover:text-gray-900',
        danger: 'text-rose-500 hover:text-rose-600',
    };

    return (
        <button
            className={`text-sm font-bold transition-colors cursor-pointer ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
