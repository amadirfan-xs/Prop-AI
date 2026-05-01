import React from 'react';

export default function AuthMinimalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-[100dvh] bg-[#f7f9fb] flex flex-col font-sans relative">

            <main className="flex-1 flex items-center justify-center p-6 w-full max-w-7xl mx-auto pt-24 pb-28">
                <div className="w-full max-w-[448px] bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-10 py-12 relative z-10 border border-gray-100 overflow-hidden">
                    {children}
                </div>
            </main>

            <footer className="absolute bottom-0 left-0 right-0 w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center z-10 text-[13px] text-gray-500 font-medium gap-4">
                <div>© 2024 The Digital Architect Property Group</div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-gray-800 transition-colors">Security</a>
                    <a href="#" className="hover:text-gray-800 transition-colors">Status</a>
                </div>
            </footer>
        </div>
    );
}
