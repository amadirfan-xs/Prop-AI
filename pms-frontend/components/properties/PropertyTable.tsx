"use client";

import { useRouter } from 'next/navigation';
import { Property } from '@/types';
import { getFulfillmentColor, getPropertyStatusStyles } from '@/utils/property.helpers';

interface PropertyTableProps {
    properties: Property[];
}

export default function PropertyTable({ properties }: PropertyTableProps) {
    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(`/properties/${id}`);
    };

    if (properties.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#3525CD] mb-6">
                    <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 max-w-[300px]">Your portfolio is currently empty. Add your first property to get started.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
            <table className="w-full text-left min-w-[900px] border-separate border-spacing-y-3">
                <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <th className="pb-4 pl-4 font-bold">Property Name</th>
                        <th className="pb-4 font-bold">Status</th>
                        <th className="pb-4 font-bold">Fulfillment Status</th>
                        <th className="pb-4 font-bold">Price</th>
                        <th className="pb-4 pr-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="">
                    {properties.map((property) => (
                        <tr
                            key={property.id}
                            onClick={() => handleRowClick(property.id)}
                            className="group bg-white hover:bg-gray-50/50 transition-colors shadow-sm cursor-pointer"
                        >
                            <td className="py-4 pl-4 rounded-l-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-[48px] h-[48px] rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-50 shadow-sm relative">
                                        <img
                                            src={property.property_media?.[0]?.signedUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=120&h=120&auto=format&fit=crop'}
                                            alt={property.property_title || 'Property'}
                                            className="w-10 h-10 rounded-lg object-cover outline outline-gray-100 -outline-offset-2"
                                        />
                                    </div>
                                    <div className="flex flex-col max-w-[200px] lg:max-w-none">
                                        <span className="text-[15px] font-bold text-gray-900 leading-tight mb-0.5 tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                                            {property.property_title || '-'}
                                        </span>
                                        <span className="text-[13px] font-medium text-gray-400 truncate">
                                            {property.street_address || '-'}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider -outline-offset-2 ${getPropertyStatusStyles(property.status || '')}`}>
                                    {property.status || '-'}
                                </span>
                            </td>
                            <td className="py-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${getFulfillmentColor(property.fulfillment_status || '')}`} />
                                    <span className="text-[14px] font-semibold text-gray-600 tracking-tight">
                                        {property.fulfillment_status || '-'}
                                    </span>
                                </div>
                            </td>
                            <td className="py-4">
                                <span className="text-[15px] font-bold text-indigo-600">
                                    {property.asking_price_monthly ? `$${property.asking_price_monthly}` : '-'}
                                </span>
                            </td>
                            <td className="py-4 pr-4 text-right rounded-r-2xl">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRowClick(property.id); }}
                                        className="flex items-center justify-center cursor-pointer p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="View Details"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
