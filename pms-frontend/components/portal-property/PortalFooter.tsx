import React from 'react';

export default function PortalFooter() {
    return (
        <footer className="bg-white border-t border-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-[#3525CD] font-black text-[22px] tracking-tighter leading-none">EstateArchitect</span>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
                        <a href="#" className="text-[13px] font-bold text-gray-500 hover:text-[#3525CD] transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[13px] font-bold text-gray-500 hover:text-[#3525CD] transition-colors">Terms of Service</a>
                        <a href="#" className="text-[13px] font-bold text-gray-500 hover:text-[#3525CD] transition-colors">Cookie Carousel</a>
                        <a href="#" className="text-[13px] font-bold text-gray-500 hover:text-[#3525CD] transition-colors">Accessibility</a>
                        <a href="#" className="text-[13px] font-bold text-gray-500 hover:text-[#3525CD] transition-colors">Contact Support</a>
                    </div>

                    {/* Copyright */}
                    <div>
                        <p className="text-[13px] font-bold text-gray-400">© 2024 EstateArchitect Global. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
