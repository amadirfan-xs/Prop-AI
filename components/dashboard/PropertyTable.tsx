"use client";

import React from 'react';
import { EyeIcon, EditIcon } from '@/constants/icons/DashboardIcons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { PropertyService } from '@/services/property.service';
import apiClient from '@/networking/apiClient';
import { Property } from '@/types';
import { getFulfillmentColor, getPropertyStatusStyles } from '@/utils/property.helpers';

export default function PropertyTable() {
    const router = useRouter();
    const [properties, setProperties] = React.useState<Property[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Limit to 5 for dashboard
                const response = await apiClient.request(PropertyService.listMyProperties({ limit: 5 }));
                setProperties(response.data?.data?.items || []);
            } catch (error) {
                console.error('Failed to fetch properties', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">Recent Properties</h3>
                <Link href="/properties" className="text-[14px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all text-left">
                    View all assets
                </Link>
            </div>

            <div className="w-full overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
                <table className="w-full text-left min-w-[800px] border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <th className="pb-4 pl-4 font-bold">Property Name</th>
                            <th className="pb-4 font-bold">Status</th>
                            <th className="pb-4 font-bold">Fulfillment Status</th>
                            <th className="pb-4 pr-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {properties.length > 0 ? (
                            properties.map((property) => (
                                <tr key={property.id} className="group bg-white hover:bg-gray-50/50 transition-colors shadow-sm cursor-pointer" onClick={() => router.push(`/properties/${property.id}`)}>
                                    <td className="py-4 pl-4 rounded-l-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-[48px] h-[48px] rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-50 shadow-sm relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={property.property_media?.[0]?.signedUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=120&h=120&auto=format&fit=crop'}
                                                    alt={property.property_title || 'Property'}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
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
                                    <td className="py-4 pr-4 text-right rounded-r-2xl" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/properties/${property.id}`)}
                                                className="flex items-center justify-center cursor-pointer p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                {''} <EyeIcon />
                                            </button>
                                            {/* <button className="flex items-center justify-center cursor-pointer p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                {''} <EditIcon />
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-[16px] font-bold text-gray-900">No properties available</p>
                                        <p className="text-[14px] font-medium text-gray-400">Items will appear here once properties are added.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
