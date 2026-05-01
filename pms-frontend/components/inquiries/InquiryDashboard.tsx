'use client';

import  { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { PropertyInquiry } from '@/types/properties';
import apiClient from '@/networking/apiClient';
import InquiryHeader from './InquiryHeader';
import InquiryList from './InquiryList';
import InquirySkeleton from './InquirySkeleton';
import Pagination from '@/components/common/Pagination';

export default function InquiryDashboard() {
    const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(9); // 3x3 grid
    const [search, setSearch] = useState('');
    
    const debouncedSearch = useDebounce(search, 500);

    const { callApi, loading } = useApi<any>();

    const fetchInquiries = useCallback(async () => {
        const result = await callApi({
            url: '/api/property/leads/inquiries',
            method: 'GET',
            params: {
                page: currentPage,
                limit,
                search: debouncedSearch.trim() || undefined
            }
        });

        if (result) {
            setInquiries(result.items);
            setTotalItems(result.meta.totalItems);
        }
    }, [currentPage, limit, debouncedSearch, callApi]);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    // Handle real-time updates via SSE
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        console.log(apiUrl);
        const sseUrl = `${apiUrl}/api/property/leads/inquiries/stream`;
        const eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            // Handle double nesting: payload.data.data
            const newInquiry = payload.data?.data || payload.data || payload;

            if (!newInquiry || !newInquiry.id) return;

            const matchesSearch = !debouncedSearch || 
                newInquiry.first_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                newInquiry.last_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                newInquiry.property_title?.toLowerCase().includes(debouncedSearch.toLowerCase());

            if (currentPage === 1 && matchesSearch) {
                setInquiries(prev => {
                    if (prev.find(i => i.id === newInquiry.id)) return prev;
                    
                    toast('New lead captured!', { icon: '📢' });
                    // Keep the list size consistent with the limit
                    const updatedList = [newInquiry, ...prev];
                    return updatedList.slice(0, limit);
                });
                setTotalItems(prev => prev + 1);
            } else if (matchesSearch) {
                // Just notify if on another page
                toast.success('New lead received!');
            }
        };

        return () => eventSource.close();
    }, [currentPage, limit, debouncedSearch]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await apiClient.patch(`/api/property/leads/inquiries/${id}/read`);
            setInquiries(prev => prev.map(inv => inv.id === id ? { ...inv, is_read: true } : inv));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const unreadCount = inquiries.filter(i => !i.is_read).length;

    return (
        <div className="space-y-6 lg:space-y-8 pb-20">
            <InquiryHeader 
                unreadCount={unreadCount} 
                search={search}
                setSearch={setSearch}
            />

            {loading ? (
                <InquirySkeleton />
            ) : (
                <>
                    <InquiryList 
                        inquiries={inquiries} 
                        onMarkAsRead={handleMarkAsRead} 
                        hasActiveFilters={!!debouncedSearch}
                    />

                    {totalItems > limit && (
                        <div className="mt-10">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={limit}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(newLimit) => {
                                    setLimit(newLimit);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
