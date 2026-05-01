import React from 'react';
import { TrendUpIcon } from '@/constants/icons/DashboardIcons';

interface StatCardProps {
    title: string;
    value: string | number;
    trendLabel: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    icon: React.FC<any>;
    iconBgColor: string;
    iconColor: string;
}

export default function StatCard({
    title,
    value,
    trendLabel,
    trendType = 'neutral',
    icon: Icon,
    iconBgColor,
    iconColor
}: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100/50 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col gap-4 lg:gap-5">
                {/* Icon Circle */}
                <div
                    className="w-[44px] h-[44px] lg:w-[52px] lg:h-[52px] rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
                    style={{ backgroundColor: iconBgColor, color: iconColor }}
                >
                    <Icon size={22} className="lg:size-26" />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-[11px] lg:text-[13px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        {title}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[28px] lg:text-[36px] font-extrabold text-gray-900 tracking-tight leading-none">
                            {value}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    {trendType === 'positive' && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[12px] lg:text-[13px] font-bold">
                            <TrendUpIcon size={14} />
                            <span>{trendLabel}</span>
                        </div>
                    )}
                    {trendType === 'neutral' && (
                        <div className="flex items-center gap-2 text-gray-400 text-[12px] lg:text-[13px] font-bold">
                            {trendLabel}
                        </div>
                    )}
                    {trendType === 'negative' && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[12px] lg:text-[13px] font-bold">
                            <span>{trendLabel}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
