import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPropertyStatusStyles, getFulfillmentColor } from '@/utils/property.helpers';

interface PropertyItem {
    id: number;
    title: string;
    status: string;
    fulfillmentStatus: string;
    media: any[];
    agentName: string;
}

interface RecentPropertiesGridProps {
    properties?: PropertyItem[];
}

export default function RecentPropertiesGrid({ properties = [] }: RecentPropertiesGridProps) {
    const router = useRouter();

    return (
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Recent Org Properties</h3>
                    <p className="text-[14px] font-medium text-gray-400">Newly added assets across all agents.</p>
                </div>
                <button
                    onClick={() => router.push('/org/properties')}
                    className="text-[14px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                    View Global Catalog
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div
                            key={property.id}
                            onClick={() => router.push(`/properties/${property.id}`)}
                            className="group cursor-pointer bg-gray-50/50 rounded-[24px] overflow-hidden border border-gray-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                        >
                            <div className="aspect-16/10 relative overflow-hidden">
                                <Image
                                    src={(property.media?.[0]?.signedUrl && property.media[0].signedUrl.trim() !== '') 
                                        ? property.media[0].signedUrl 
                                        : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&auto=format&fit=crop'}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    unoptimized={true}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${getPropertyStatusStyles(property.status)}`}>
                                        {property.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <h4 className="text-[16px] font-black text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                        {property.title}
                                    </h4>
                                    <p className="text-[13px] font-medium text-gray-400">
                                        Agent: <span className="text-gray-600 font-bold">{property.agentName}</span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getFulfillmentColor(property.fulfillmentStatus)}`} />
                                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">
                                            {property.fulfillmentStatus}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-indigo-600 transition-colors">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 py-10 text-center">
                        <p className="text-[14px] font-medium text-gray-400">No properties found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
