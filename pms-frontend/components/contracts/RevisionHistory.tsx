import React, { useEffect } from 'react';
import PropertyService from '@/services/property.service';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ContractVersion } from '@/types/properties';

interface RevisionHistoryProps {
    propertyId: string;
    onVersionSelect: (version: ContractVersion) => void;
    onToggleVersion?: (version: ContractVersion) => void;
    currentVersionId?: number;
    selectedIds?: number[];
    revisions?: ContractVersion[];
}

export default function RevisionHistory({ 
    propertyId, 
    onVersionSelect, 
    onToggleVersion,
    currentVersionId, 
    selectedIds,
    revisions: revisionsProp
}: RevisionHistoryProps) {
    const router = useRouter();
    const {
        data: fetchedRevisions,
        loading: revisionsLoading,
        callApi: fetchRevisionsApi
    } = useApi<ContractVersion[]>();

    const revisions = revisionsProp || fetchedRevisions;
    const loading = !revisionsProp && revisionsLoading;

    useEffect(() => {
        if (propertyId && !revisionsProp) {
            fetchRevisions();
        }
    }, [propertyId, revisionsProp]);

    const fetchRevisions = async () => {
        try {
            const data = await fetchRevisionsApi(PropertyService.listContractVersions(Number(propertyId)));
            // Auto-select latest if none selected
            if (!currentVersionId && data && data.length > 0) {
                onVersionSelect(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch revisions:', error);
        }
    };

    const handleVersionClick = (item: ContractVersion) => {
        if (onToggleVersion) {
            onToggleVersion(item);
        } else {
            onVersionSelect(item);
        }
    };
    return (
        <div className="bg-white w-auto rounded-xl p-5 text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3" >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#4F46E5] text-[24px]">history</span>
                    </div>
                    <div>
                        <h3 className="text-[20px] font-black text-gray-900 tracking-tight">Revision History</h3>
                        <p className="text-[13px] font-medium text-gray-400">Track all changes and negotiation</p>
                    </div>
                </div>
                <button 
                    onClick={() => router.push(`/properties/${propertyId}/contracts/history`)}
                    className="text-[#4F46E5] font-black text-[14px] flex items-center gap-1 hover:gap-2 transition-all p-2 hover:bg-indigo-50 rounded-lg"
                >
                    View All
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-indigo-100 border-t-[#4F46E5] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="relative space-y-0">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[7px] top-2 bottom-6 w-[2px] bg-gray-100" />
                    {(revisions || [])
                        .slice(0, 3)
                        .map((item, index) => {
                            const isSelected = selectedIds?.includes(item.id) || item.id === currentVersionId;
                            
                            return (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleVersionClick(item)}
                                    className={`relative pl-10 pb-10 last:pb-0 cursor-pointer group`}
                                >
                                    {/* Selection Indicator */}
                                    <div className={`absolute left-0 top-1.5 w-[18px] h-[18px] rounded-[6px] border-2 transition-all flex items-center justify-center
                                        ${isSelected 
                                            ? 'bg-[#4F46E5] border-[#4F46E5]' 
                                            : 'bg-white border-gray-200 group-hover:border-indigo-300'}`}
                                    >
                                        {isSelected && (
                                            <span className="material-symbols-outlined text-white text-[14px]">check</span>
                                        )}
                                    </div>

                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex flex-col">
                                            <h4 className="text-[16px] font-black text-gray-900 leading-tight">
                                                Version {(revisions?.length ?? 0) - index}
                                            </h4>
                                            <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5
                                                ${(item.status || 'PENDING') === 'APPROVED' ? 'text-emerald-500' :
                                                  (item.status || 'PENDING') === 'REJECTED' ? 'text-rose-500' :
                                                  (item.status || 'PENDING') === 'REQUESTED_CHANGES' ? 'text-amber-500' : 'text-indigo-400'}`}
                                            >
                                                {(item.status || 'PENDING').replace('_', ' ')}
                                            </span>
                                        </div>
                                        <span className="text-[12px] font-black text-gray-400 tracking-widest uppercase">
                                            {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className={`rounded-[22px] px-6 py-4 border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-100' : 'bg-[#F8F9FF] border-indigo-50/50 group-hover:bg-white'}`}>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[13px] leading-[1.6] text-gray-600 font-medium">
                                                <strong className="text-[#4F46E5] font-black mr-1">
                                                    {item.input_source.toUpperCase() === 'PDF' ? 'PDF Upload' : 'Digital Edit'}
                                                </strong> 
                                            </p>
                                            {item.consensusStats && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-gray-100 rounded-md shadow-sm">
                                                    <span className="material-symbols-outlined text-[12px] text-gray-400">group</span>
                                                    <span className="text-[9px] font-black text-gray-600 tracking-wider">
                                                        {item.consensusStats.totalApproved}/{item.consensusStats.totalRequired}
                                                    </span>
                                                </div>
                                            )}
                                            {item.decisions && item.decisions.length > 0 && (
                                                <div className="flex -space-x-2">
                                                    {item.decisions.slice(0, 3).map((d, i) => (
                                                        <div key={i} title={`${d.userName}: ${d.decision}`} className={`w-5 h-5 rounded-full border border-white flex items-center justify-center text-[8px] font-black text-white
                                                            ${d.decision === 'Approve' ? 'bg-emerald-400' : d.decision === 'Reject' ? 'bg-rose-400' : 'bg-amber-400'}`}
                                                        >
                                                            {d.userName.charAt(0)}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div >
    );
}
