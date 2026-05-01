'use client';

import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/common/Button';
import { Property } from '@/types/properties';

export default function QRPreviewSidebar({ property }: { property: Property | null }) {
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `QR-${property?.property_title || 'Property'}.png`;
            link.href = url;
            link.click();
        }
    };

    if (!property) return null;

    // Build the tracking URL pointing to the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const trackingUrl = `${backendUrl}/api/public/property/${property.id}/scan`;

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-xl shadow-indigo-100/20 space-y-10 flex flex-col items-center lg:sticky lg:top-24">
            <div className="text-center space-y-2">
                <h3 className="text-[18px] md:text-[20px] font-black text-gray-900">Live Preview</h3>
                <p className="text-[12px] md:text-[13px] font-bold text-gray-400">Scan to preview the property tour</p>
            </div>

            {/* QR Code Holder */}
            <div className="w-full aspect-square bg-white border-[8px] md:border-[16px] border-gray-50 rounded-[32px] md:rounded-[40px] shadow-inner p-4 md:p-8 relative group">
                <div
                    ref={canvasRef}
                    className="w-full h-full bg-[#2A2A2A] rounded-2xl flex items-center justify-center overflow-hidden relative transition-all duration-700 p-8"
                >
                    <QRCodeCanvas
                        value={trackingUrl}
                        size={512}
                        level="H"
                        includeMargin={false}
                        className="w-full h-full"
                        style={{ height: 'auto', width: '100%' }}
                    />
                    {/* Subtle Scan lines */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 w-full animate-scan pointer-events-none"></div>
                </div>
            </div>

            <div className="w-full space-y-4">
                <Button 
                    onClick={() => window.open(trackingUrl, '_blank')}
                    className="w-full py-5 rounded-2xl uppercase tracking-widest text-[13px]"
                >
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                    <span>Test Scan Link</span>
                </Button>
                
                <Button 
                    onClick={handleDownload}
                    variant="secondary"
                    className="w-full py-5 rounded-2xl uppercase tracking-widest text-[13px] border border-gray-100 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span>Download QR Code (PNG)</span>
                </Button>
            </div>

            <div className="w-full pt-8 border-t border-gray-50 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 text-center">Format</p>
                    <p className="text-[13px] font-black text-gray-900">PNG / 512px</p>
                </div>
                <div className="h-8 w-px bg-gray-100"></div>
                <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 text-center">Security</p>
                    <p className="text-[13px] font-black text-[#3525CD]">Tracking ON</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                    position: absolute;
                }
            `}</style>
        </div>
    );
}
