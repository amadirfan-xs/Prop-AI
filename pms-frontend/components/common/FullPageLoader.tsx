"use client";

import React from "react";

interface FullPageLoaderProps {
  message?: string;
  submessage?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({ 
  message = "Processing...", 
  submessage = "Please do not refresh or close this page." 
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] p-12 lg:p-16 shadow-2xl shadow-black/20 flex flex-col items-center space-y-8 max-w-md w-full mx-4 transform animate-in zoom-in slide-in-from-bottom-8 duration-700">
        <div className="relative">
          {/* Main Spinner */}
          <div className="w-24 h-24 border-[6px] border-indigo-50 border-t-[#4F46E5] rounded-full animate-spin"></div>
          
          {/* Pulsing Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-full animate-pulse-slow flex items-center justify-center">
              <span className="material-symbols-outlined text-[#4F46E5] text-[32px] animate-bounce-subtle">
                upload_file
              </span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">
            {message}
          </h2>
          <p className="text-gray-500 font-medium text-[16px] leading-relaxed opacity-80">
            {submessage}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-bounce"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
