import React from 'react';

interface Property {
    id: string;
    title: string;
    address: string;
    image: string;
    agent: { name: string; avatar: string };
    price: string;
    status: 'ACTIVE' | 'PENDING' | 'SOLD';
    buyerStatus: 'VERIFIED' | 'OFFER' | 'CLOSED' | 'PENDING';
    sellerStatus: 'READY' | 'SIGNED' | 'CLOSED';
    created: string;
    type: string;
}

const properties: Property[] = [
    {
        id: '1',
        title: 'The Glass Pavilion',
        address: '482 Silver Lake Dr, Los Angeles, ...',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&h=60&q=80',
        agent: { name: 'Jordan Smith', avatar: '' },
        price: '$4,250,000',
        status: 'ACTIVE',
        buyerStatus: 'VERIFIED',
        sellerStatus: 'READY',
        created: 'Oct 12, 2023',
        type: 'Residential Apartment'
    },
    {
        id: '2',
        title: 'Azure Bay Estate',
        address: '102 Ocean Way, Malibu, CA',
        image: 'https://images.unsplash.com/photo-1600607687940-4e2303c907fd?auto=format&fit=crop&w=100&h=60&q=80',
        agent: { name: 'Sarah Jenkins', avatar: '' },
        price: '$8,900,000',
        status: 'PENDING',
        buyerStatus: 'OFFER',
        sellerStatus: 'SIGNED',
        created: 'Nov 05, 2023',
        type: 'Luxury Villa'
    },
    {
        id: '3',
        title: 'Cedar Ridge Loft',
        address: '22 Pinecrest Rd, Aspen, CO',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=100&h=60&q=80',
        agent: { name: 'Michael Chen', avatar: '' },
        price: '$1,150,000',
        status: 'SOLD',
        buyerStatus: 'CLOSED',
        sellerStatus: 'CLOSED',
        created: 'Sep 18, 2023',
        type: 'Commercial Office'
    },
    {
        id: '4',
        title: 'Skyline Penthouse',
        address: '900 5th Avenue, New York, NY',
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=100&h=60&q=80',
        agent: { name: 'Elena Rodriguez', avatar: '' },
        price: '$12,400,000',
        status: 'ACTIVE',
        buyerStatus: 'PENDING',
        sellerStatus: 'READY',
        created: 'Dec 01, 2023',
        type: 'Residential House'
    }
];

const StatusBadge = ({ type, label }: { type: string, label: string }) => {
    const styles: Record<string, string> = {
        ACTIVE: 'bg-indigo-50 text-indigo-600',
        PENDING: 'bg-purple-50 text-purple-600',
        SOLD: 'bg-gray-100 text-gray-400',
        VERIFIED: 'text-[#10b981] font-black',
        OFFER: 'text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md font-black',
        CLOSED: 'text-gray-400 font-bold',
        READY: 'text-gray-400 font-bold',
        SIGNED: 'text-gray-400 font-bold',
    };

    return (
        <span className={`text-[11px] uppercase tracking-wider ${styles[label] || styles[type] || ''} ${['ACTIVE', 'PENDING', 'SOLD'].includes(label) ? 'px-2.5 py-1 rounded-lg font-black' : ''}`}>
            {label}
        </span>
    );
};

export default function PropertyPortfolioTable() {
    return (
        <div className="bg-white rounded-[40px] border border-gray-100/50 shadow-sm shadow-indigo-100/20 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="pl-10 pr-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Property Details</th>
                            <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Assigned Agent</th>
                            <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Buyer</th>
                            <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Seller</th>
                            <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Created</th>
                            <th className="pl-4 pr-10 py-8 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-none">
                                <td className="pl-10 pr-4 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                                            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-black text-gray-900 leading-tight mb-1">{property.title}</p>
                                            <p className="text-[13px] font-medium text-gray-500">{property.address}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                                            <img src={`https://ui-avatars.com/api/?name=${property.agent.name}&background=F3F4F7&color=4F46E5`} alt={property.agent.name} />
                                        </div>
                                        <span className="text-[14px] font-black text-gray-900">{property.agent.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-6">
                                    <span className="text-[13px] font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                        {property.type}
                                    </span>
                                </td>
                                <td className="px-4 py-6 text-[15px] font-black text-gray-900">{property.price}</td>
                                <td className="px-4 py-6">
                                    <StatusBadge type="status" label={property.status} />
                                </td>
                                <td className="px-4 py-6">
                                    <StatusBadge type="buyer" label={property.buyerStatus} />
                                </td>
                                <td className="px-4 py-6">
                                    <StatusBadge type="seller" label={property.sellerStatus} />
                                </td>
                                <td className="px-4 py-6 text-[13px] font-medium text-gray-500">{property.created}</td>
                                <td className="pl-4 pr-10 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                        <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                <span className="text-[14px] font-medium text-gray-500">Showing <span className="text-gray-900 font-bold">1 - 4</span> of 1,284 properties</span>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all active:scale-95">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-[#3525CD] text-white text-[14px] font-black shadow-lg shadow-indigo-100">1</button>
                    <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[14px] font-black text-gray-500 hover:bg-white hover:text-gray-900 transition-all">2</button>
                    <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[14px] font-black text-gray-500 hover:bg-white hover:text-gray-900 transition-all">3</button>
                    <span className="mx-2 text-gray-400">...</span>
                    <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[14px] font-black text-gray-500 hover:bg-white hover:text-gray-900 transition-all">321</button>
                    <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all active:scale-95">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
