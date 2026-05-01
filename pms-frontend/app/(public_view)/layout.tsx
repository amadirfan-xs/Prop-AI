import React from 'react';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased font-sans text-gray-900">
            {children}
        </div>
    );
}
