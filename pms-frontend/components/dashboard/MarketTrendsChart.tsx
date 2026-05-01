interface MarketTrendsChartProps {
    data?: Array<{
        month: string;
        value: number;
    }>;
    loading?: boolean;
}

export default function MarketTrendsChart({ data, loading }: MarketTrendsChartProps) {
    const defaultData = [
        { month: 'Jan', value: 0 },
        { month: 'Feb', value: 0 },
        { month: 'Mar', value: 0 },
        { month: 'Apr', value: 0 },
        { month: 'May', value: 0 },
        { month: 'Jun', value: 0 },
        { month: 'Jul', value: 0 },
    ];

    const chartData = data && data.length > 0 ? data : defaultData;

    return (
        <div className="bg-white rounded-3xl p-5 lg:p-8 border border-gray-100 shadow-sm flex flex-col h-full min-h-75">
            <h3 className="text-[16px] lg:text-[18px] font-bold text-gray-900 mb-6 lg:mb-10 tracking-tight">Market Trends (Properties Added)</h3>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="flex-1 flex items-end justify-between gap-1.5 lg:gap-3 min-h-40 lg:min-h-45 pb-4 lg:pb-6">
                    {chartData.map((item, index) => (
                        <div key={`${item.month}-${index}`} className="flex-1 flex flex-col items-center gap-3 lg:gap-4 group">
                            <div className="relative w-full flex justify-center items-end h-30 lg:h-40">
                                {/* Bar */}
                                <div
                                    className={`w-full max-w-8 lg:max-w-25 rounded-t-lg transition-all duration-500 cursor-pointer group-hover:scale-y-105 ${index === chartData.length - 1
                                        ? 'bg-indigo-600 shadow-[0_4px_20px_rgba(79,70,229,0.3)]'
                                        : 'bg-indigo-100 group-hover:bg-indigo-200'
                                        }`}
                                    style={{ height: `${Math.min(Math.max(item.value * 10, 5), 100)}%` }}
                                />

                                {/* Tooltip on hover */}
                                <div className="absolute -top-10 scale-0 lg:group-hover:scale-100 transition-transform bg-gray-900 text-white text-[10px] lg:text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl z-10 whitespace-nowrap">
                                    {item.value} Properties
                                </div>
                            </div>
                            <span className={`text-[10px] lg:text-[11px] font-bold uppercase tracking-wider ${index === chartData.length - 1 ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                {item.month}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
