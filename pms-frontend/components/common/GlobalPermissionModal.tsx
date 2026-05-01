"use client";

import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useRouter } from 'next/navigation';

export default function GlobalPermissionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const handleForbidden = (event: any) => {
            const data = event.detail;
            setErrorMessage(data?.message || null);
            setIsOpen(true);
        };
        window.addEventListener('api:error:403', handleForbidden);
        return () => window.removeEventListener('api:error:403', handleForbidden);
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="max-w-md">
            <div className="p-8 text-center flex items-center justify-center flex-col">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-[40px] text-red-500">lock</span>
                </div>
                <h2 className="text-loading text-2xl font-black text-gray-900 tracking-tight mb-2">Access Denied</h2>
                <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                    {errorMessage || "You do not have the necessary permissions to access this resource or perform this action."}
                </p>
                <div className="w-full flex flex-col gap-3">
                    <Button 
                        onClick={() => { setIsOpen(false); router.push('/'); }} 
                        className="w-full justify-center bg-[#3525CD] text-white!"
                    >
                        Return to Dashboard
                    </Button>
                    <Button 
                        onClick={() => setIsOpen(false)} 
                        className="w-full justify-center bg-white! border border-gray-200! text-gray-700! hover:bg-gray-50!"
                    >
                        Dismiss
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
