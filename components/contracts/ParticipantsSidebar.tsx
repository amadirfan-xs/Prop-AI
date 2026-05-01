"use client";

import React from 'react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { getPermissions } from '@/lib/config/permissions';
import { Stakeholder } from '@/types/properties';

interface ParticipantsSidebarProps {
    onInvite?: () => void;
    showInviteButton?: boolean;
    stakeholders: Stakeholder[];
    propertyStatus?: string;
}

export default function ParticipantsSidebar({ onInvite, showInviteButton = true, stakeholders = [], propertyStatus }: ParticipantsSidebarProps) {
   
    const { primaryRole } = useAuth();
    const permissions = getPermissions(primaryRole || undefined);
    return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-[24px] font-black text-gray-900 tracking-tight">Participants</h3>
                {showInviteButton && propertyStatus?.toLowerCase() !== 'completed' && (
                    <Button
                        onClick={onInvite}
                        className="!w-auto !p-0 !bg-transparent !border-transparent !shadow-none !text-[#4F46E5] hover:!text-[#4338CA] transition-colors"
                    >
                        <span className="material-symbols-outlined text-[32px] font-medium leading-none">person_add</span>
                    </Button>
                )}
            </div>

            <div className="space-y-4 mb-10">
                {stakeholders && stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="bg-white rounded-[24px] px-6 py-5 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar with Status Overlay */}
                            <div className="relative">
                                <img
                                    src={stakeholder.user.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(stakeholder.user.name)}&background=4F46E5&color=fff`}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                    alt={stakeholder.user.name}
                                />
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${stakeholder.status === 'pending' ? 'bg-[#FFB800]' : 'bg-[#10B981]'
                                    }`}>
                                    <span className="material-symbols-outlined text-white text-[14px] font-bold">
                                        {stakeholder.status === 'pending' ? 'schedule' : 'check'}
                                    </span>
                                </div>
                            </div>

                            {/* Name and Meta */}
                            <div className="space-y-0.5">
                                <h4 className="text-[17px] font-black text-gray-900 leading-tight">{stakeholder.user.name}</h4>
                                <p className="text-[14px] font-medium text-gray-400 capitalize">
                                    {stakeholder.userType?.name || 'Stakeholder'} <span className="mx-1">•</span> {stakeholder.status}
                                </p>
                            </div>
                        </div>

                        {/* Action Area */}
                        {permissions.canInviteStakeholders && propertyStatus?.toLowerCase() !== 'completed' && (
                            <div>
                                {stakeholder.status === 'pending' ? (
                                    <Button className="!w-auto !px-2 !py-1 !bg-transparent !border-transparent !shadow-none !text-[#4F46E5] !font-black !text-[12px] tracking-widest uppercase hover:!text-[#4338CA] transition-all">
                                        Re-Invite
                                    </Button>
                                ) : (
                                    <Button className="!w-auto !p-2 !bg-transparent !border-transparent !shadow-none !text-[#C0C4D6] hover:!text-[#4F46E5] transition-colors flex items-center">
                                        <span className="material-symbols-outlined text-[24px]">mail</span>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                
                {(!stakeholders || stakeholders.length === 0) && (
                    <div className="text-center py-6 text-gray-400 text-[14px] font-medium">
                        No participants invited yet.
                    </div>
                )}
            </div>
        </div>
    );
}

