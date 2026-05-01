'use client';

import { Property } from '@/types/properties';

export default function PropertyPreviewCard({ property }: { property: Property | null }) {
    if (!property) return null;

    const mainImage = property.property_media?.[0]?.signedUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop';

    return (
        <div className="bg-[#F8F9FF] p-4 md:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-indigo-50/50">
            <div className="w-full sm:w-32 h-40 sm:h-24 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                <img
                    src={mainImage}
                    alt={property.property_title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-[#3525CD] text-[10px] font-black uppercase tracking-tighter rounded">Active</span>
                    <span className="text-[16px] font-black text-[#3525CD]">${Number(property.asking_price_monthly).toLocaleString()}/mo</span>
                </div>
                <h3 className="text-[18px] font-black text-gray-900 leading-tight">{property.property_title}</h3>
                <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span className="text-[12px] font-bold">{property.street_address}</span>
                </div>
            </div>
        </div>
    );
}
