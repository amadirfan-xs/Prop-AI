import React from 'react';
import { LogoIcon } from '@/constants/icons/AuthIcons';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-white font-sans text-gray-900">
            {/* Left side */}
            <div className="hidden lg:flex lg:w-[45%] relative bg-[#3b43a9] text-white overflow-hidden flex-col justify-between">
                <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-95"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#3b43a9]/90 to-[#273291]/80 pointer-events-none" />

                <div className="relative z-10 p-12 mt-4">
                    <div className="flex items-center gap-3 font-bold text-[1.2rem] tracking-tight">
                        <div className="bg-white text-[#3b43a9] p-[6px] rounded-lg flex items-center justify-center">
                            <LogoIcon size={18} />
                        </div>
                        Estate Ledger
                    </div>
                </div>

                <div className="relative z-10 px-12 pb-16 max-w-xl">
                    <h1 className="text-[2.75rem] font-bold leading-[1.1] mb-6 drop-shadow-sm">
                        The architecture of<br />modern wealth<br />management.
                    </h1>
                    <p className="text-[1.1rem] text-indigo-100/90 italic mb-10 font-semibold max-w-sm drop-shadow-sm">
                        "Design is not just what it looks like and feels like. Design is how it works — and how your assets grow."
                    </p>
                    <div className="flex items-center text-xs font-bold tracking-[0.15em] text-indigo-100 mt-2">
                        <span className="w-8 h-0.5 bg-white mr-4"></span>
                        DIGITAL ARCHITECT PERSPECTIVE
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-0 relative min-h-[100dvh] lg:min-h-0 lg:h-screen overflow-y-auto">
                <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-16 w-full max-w-2xl mx-auto py-12 lg:py-0 mt-8 lg:mt-0">
                    <header className="mb-10 lg:hidden flex flex-col items-center">
                        <div className="bg-[#3b43a9] text-white p-[8px] rounded-xl flex items-center justify-center shadow-md mb-4">
                            <LogoIcon size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Estate Ledger</h2>
                    </header>
                    {children}
                </main>

                <footer className="w-full pb-8 pt-4 text-center text-xs text-gray-400 mt-auto">
                    <div className="flex justify-center gap-4 mb-3 tracking-widest font-bold text-[10px]">
                        <a href="#" className="hover:text-gray-600 transition-colors uppercase">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600 transition-colors uppercase">Terms of Service</a>
                        <a href="#" className="hover:text-gray-600 transition-colors uppercase">Security</a>
                    </div>
                    <p className="text-[10px] text-gray-400/80">© 2024 The Digital Architect Property Group</p>
                </footer>
            </div>
        </div>
    );
}
