"use client";

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (limit: number) => void;
}

export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-8 px-4 border-t border-gray-100 mt-4">
            {/* Left: Rows per page selector */}
            <div className="flex items-center gap-3 order-2 lg:order-1">
                <span className="text-[14px] font-medium text-gray-500">Rows per page:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[14px] font-bold text-gray-900 outline-none focus:border-[#3525CD] transition-colors cursor-pointer"
                    title="Rows per page"
                >
                    {[5, 10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>

            {/* Center: Result Summary */}
            <div className="order-1 lg:order-2">
                <p className="text-[14px] font-medium text-gray-400">
                    Showing <span className="font-bold text-gray-900">{totalItems === 0 ? 0 : startItem}–{endItem}</span> of <span className="font-bold text-gray-900">{totalItems}</span> results
                </p>
            </div>

            {/* Right: Pagination Buttons */}
            <div className="flex items-center gap-2 order-3">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#3525CD] hover:border-[#3525CD] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map(num => (
                        <button
                            key={num}
                            onClick={() => onPageChange(num)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-[14px] transition-all ${currentPage === num
                                ? 'bg-[#3525CD] text-white shadow-lg shadow-indigo-100'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#3525CD]'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#3525CD] hover:border-[#3525CD] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
