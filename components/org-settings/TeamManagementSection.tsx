import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import React from 'react';

const teamMembers = [
    {
        name: 'Sarah Mitchell',
        email: 'sarah.m@skyline realty.com',
        role: 'Senior Broker',
        roleColor: 'bg-indigo-50 text-indigo-600',
        status: 'Active',
        statusColor: 'bg-green-500',
        lastLogin: '2h ago',
        avatar: 'https://ui-avatars.com/api/?name=SM&background=F3F4F7&color=4F46E5'
    },
    {
        name: 'David Chen',
        email: 'd.chen@skylinerealty.com',
        role: 'Admin',
        roleColor: 'bg-orange-50 text-orange-600',
        status: 'Active',
        statusColor: 'bg-green-500',
        lastLogin: '14m ago',
        avatar: 'https://ui-avatars.com/api/?name=DC&background=F3F4F7&color=4F46E5'
    },
    {
        name: 'Elena Martinez',
        email: 'e.martinez@skylinerealty.com',
        role: 'Leasing Agent',
        roleColor: 'bg-gray-100 text-gray-600',
        status: 'On Leave',
        statusColor: 'bg-orange-400',
        lastLogin: '3d ago',
        avatar: 'https://ui-avatars.com/api/?name=EM&background=F3F4F7&color=4F46E5'
    }
];

export default function TeamManagementSection() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-[20px] font-black text-gray-900 tracking-tight mb-2">Team Management</h2>
                    <p className="text-[14px] font-medium text-gray-500">Active agents and administrative personnel.</p>
                </div>

                <div className="flex items-center justify-center gap-2 ">
                    {/* <div className="relative self-center group"> */}
                    <Input
                        label=""
                        type="text"
                        placeholder="Search agents..."
                        className='!py-3.5 self-center px-2'
                    />
                    {/* </div> */}
                    <Button className="flex items-centbetweener gap-2  self-center !bg-white !border !border-gray-100 !rounded-xl !text-[13px] !font-black !text-gray-700 !hover:bg-gray-50 !transition-all !shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        <span>Filter</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100/50 shadow-sm shadow-indigo-100/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/30">
                                <th className="pl-10 pr-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest">Agent Name</th>
                                <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest text-center">Role</th>
                                <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-4 py-8 text-sm font-black text-gray-400 uppercase tracking-widest text-center">Last Login</th>
                                <th className="pl-4 pr-10 py-8 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map((member, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-none">
                                    <td className="pl-10 pr-4 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <img src={member.avatar} alt={member.name} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-black text-gray-900 leading-tight mb-1">{member.name}</p>
                                                <p className="text-[13px] font-medium text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <span className={`inline-block px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest ${member.roleColor}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${member.statusColor}`}></div>
                                            <span className="text-[13px] font-black text-gray-900">{member.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-[13px] font-medium text-gray-500 text-center">{member.lastLogin}</td>
                                    <td className="pl-4 pr-10 py-6 text-right">
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center px-10 py-8 bg-gray-50/30 border-t border-gray-50 text-center">
                    <Button className="!px-8 !py-3 !text-indigo-600 !border !bg-transparent !border-indigo-100 !h   over:bg-indigo-100 !rounded-xl !text-[14px] !font-black !transition-all">
                        View All 42 Agents
                    </Button>
                </div>
            </div>
        </div>
    );
}
