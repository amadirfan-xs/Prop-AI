import React from 'react';
import { LogoIcon, ChartIcon, ShieldIcon } from '@/constants/icons/AuthIcons';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-white font-sans text-gray-900">
            {/* Left side */}
            <div className="hidden lg:flex lg:w-[45%] relative bg-[#f1f3f7] overflow-hidden flex-col justify-between border-r border-gray-200">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-transparent to-[#e8eef6]/90 pointer-events-none" />

                <div className="relative z-10 p-12 mt-4">
                    <div className="flex items-center gap-3 font-bold text-[1.2rem] tracking-tight text-[#5b51e0]">
                        <div className="bg-[#5b51e0] text-white p-[6px] rounded-lg flex items-center justify-center">
                            <LogoIcon size={18} />
                        </div>
                        Digital Architect
                    </div>

                    <div className="mt-20 max-w-sm">
                        <h1 className="text-[2.75rem] font-bold text-gray-900 leading-[1.15] mb-6">
                            Precision in Every <br />Property Managed.
                        </h1>
                        <p className="text-[1.1rem] text-gray-600 font-medium leading-relaxed mt-4">
                            Join the elite network of real estate professionals leveraging architectural clarity to scale their portfolios.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 px-12 pb-24 w-full flex gap-4">
                    <div className="bg-white/95 backdrop-blur-md border border-white/50 p-5 rounded-2xl shadow-xl shadow-[#5b51e0]/5 flex-1 max-w-[240px]">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5b51e0] mb-3">
                            <ChartIcon size={18} />
                        </div>
                        <h3 className="font-bold text-[13px] text-gray-900 mb-1">Advanced Yield Analytics</h3>
                        <p className="text-[12px] text-gray-500 font-medium leading-relaxed">Real-time data at your fingertips.</p>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md border border-white/50 p-5 rounded-2xl shadow-xl shadow-[#5b51e0]/5 flex-1 max-w-[240px]">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5b51e0] mb-3">
                            <ShieldIcon size={18} />
                        </div>
                        <h3 className="font-bold text-[13px] text-gray-900 mb-1">Secure Onboarding</h3>
                        <p className="text-[12px] text-gray-500 font-medium leading-relaxed">Enterprise-grade agent protection.</p>
                    </div>
                </div>

                <div className="absolute bottom-8 left-12 z-10 text-[11px] font-bold text-gray-400">
                    © 2024 The Digital Architect Property Group
                </div>
            </div>

            {/* Right side */}
            <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-0 relative overflow-y-auto">
                <main className="flex-1 flex flex-col justify-center items-center px-6 lg:px-16 w-full max-w-2xl mx-auto pt-16 lg:pt-0 pb-24 lg:pb-0">
                    <div className="w-full max-w-[420px]">
                        {children}
                    </div>
                </main>

                <footer className="w-full pb-8 pt-4 text-center text-xs text-gray-400 mt-auto lg:absolute lg:bottom-0 lg:left-0 lg:right-0 bg-white">
                    <div className="flex justify-center gap-6 mb-3 tracking-widest font-bold text-[12px]">
                        <a href="#" className="hover:text-gray-600 transition-colors capitalize">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600 transition-colors capitalize">Terms of Service</a>
                        <a href="#" className="hover:text-gray-600 transition-colors capitalize">Security</a>
                        <a href="#" className="hover:text-gray-600 transition-colors capitalize">Status</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
