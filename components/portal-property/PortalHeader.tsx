"use client";

import React, { useState, useEffect } from "react";
import { PORTAL_NAV_LINKS } from "@/constants/navigation";

export default function PortalHeader() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = PORTAL_NAV_LINKS.map((link) => link.id);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = PORTAL_NAV_LINKS;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-9 h-9 md:w-10 md:h-10 bg-[#3525CD] rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">
              architecture
            </span>
          </div>
          <span className="text-[#3525CD] font-black text-[18px] md:text-[22px] tracking-tighter">
            Estate Architect
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`text-[13px] uppercase tracking-widest transition-all duration-300 ${
                activeSection === link.id
                  ? "text-[#3525CD] font-black border-b-2 border-[#3525CD] pb-1"
                  : "text-gray-500 font-bold hover:text-[#3525CD]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* <button className="hidden sm:block px-6 py-2 border border-[#3525CD] text-[#3525CD] text-[11px] font-black rounded-lg uppercase tracking-widest hover:bg-[#3525CD] hover:text-white transition-all">
                        Portal Login
                    </button> */}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-900"
          >
            <span className="material-symbols-outlined text-[32px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-white z-40 animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col p-8 gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-[18px] uppercase tracking-[0.2em] transition-all ${
                  activeSection === link.id
                    ? "text-[#3525CD] font-black"
                    : "text-gray-500 font-bold"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-8 border-t border-gray-100">
              <button className="w-full py-4 bg-[#3525CD] text-white text-[13px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-indigo-100">
                Agent Login
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
