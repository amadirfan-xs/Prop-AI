import React, { useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { useApi } from '@/hooks/useApi';
import SocialService, { SocialDestination, StartConnectResponse } from '@/services/social.service';
import { toastService } from '@/utils/toastService';
import { useSearchParams } from 'next/navigation';

export const SocialMediaTab: React.FC = () => {
    const { 
        callApi: fetchDestinations, 
        data: destinations,
        loading: isLoading
    } = useApi<SocialDestination[]>();

    const { 
        callApi: startConnect, 
        loading: isConnecting 
    } = useApi<StartConnectResponse>();

    const { 
        callApi: disconnectAccount, 
        loading: isDisconnecting 
    } = useApi();

    const [disconnectingPlatform, setDisconnectingPlatform] = React.useState<string | null>(null);

    const searchParams = useSearchParams();
    const status = searchParams.get('status');

    useEffect(() => {
        if (status === 'success') {
            fetchDestinations(SocialService.listDestinations());
        }
    }, [status, fetchDestinations]);

    useEffect(() => {
        fetchDestinations(SocialService.listDestinations());
    }, [fetchDestinations]);

    const handleConnect = async (platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok') => {
        try {
            const result = await startConnect(SocialService.startConnect(platform));
            if (result?.authorizationUrl) {
                window.location.href = result.authorizationUrl;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || `Failed to start ${platform} connection.`;
            toastService.error(message);
        }
    };

    const handleDisconnect = async () => {
        if (!disconnectingPlatform) return;
        
        try {
            await disconnectAccount(SocialService.disconnectPlatform(disconnectingPlatform));
            fetchDestinations(SocialService.listDestinations());
            toastService.success(`${disconnectingPlatform} disconnected successfully`);
        } catch (error) {
            toastService.error(`Failed to disconnect ${disconnectingPlatform}`);
        } finally {
            setDisconnectingPlatform(null);
        }
    };

    const getConnectedInfo = (platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok') => {
        const platformDestinations = destinations?.filter(d => d.platform === platform) || [];
        if (platformDestinations.length === 0) return null;
        
        return {
            isConnected: true,
            names: platformDestinations.map(d => d.destinationName).join(', ')
        };
    };

    const renderCard = (platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok', label: string, colorClass: string) => {
        const info = getConnectedInfo(platform);
        
        return (
            <div className={`flex items-center justify-between p-6 rounded-[24px] border border-gray-100/80 transition-all duration-300 ${info ? 'bg-white shadow-md' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${info ? colorClass : 'bg-gray-200'}`}>
                        {platform === 'facebook' && (
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        )}
                        {platform === 'instagram' && (
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.012 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.012-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                            </svg>
                        )}
                        {platform === 'linkedin' && (
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                        )}
                        {platform === 'tiktok' && (
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.6-4.03-1.37-.01 3.9-.01 7.8-.02 11.7-.01 2.85-2.26 5.61-5.18 5.69-3.08.13-5.94-2.14-6.1-5.23-.2-4.02 3.63-7.53 7.6-6.3v4.1c-1.39-.51-3.11.13-3.69 1.52-.45 1.08.12 2.51 1.25 2.92 1.12.44 2.54-.15 2.88-1.31.06-.21.07-.43.07-.65V.02z"/>
                            </svg>
                        )}
                    </div>
                    <div>
                        <h3 className="text-[17px] font-bold text-gray-900">{label}</h3>
                        {info ? (
                            <div className="flex flex-col">
                                <p className="text-[13px] font-medium text-green-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    Connected
                                </p>
                                <p className="text-[11px] text-gray-400 truncate max-w-[200px]">
                                    {info.names}
                                </p>
                            </div>
                        ) : (
                            <p className="text-[13px] font-medium text-gray-400">Not connected</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {info && (
                        <button 
                            onClick={() => setDisconnectingPlatform(platform)}
                            className="text-[13px] font-bold text-red-500 hover:text-red-600 transition-colors px-4"
                        >
                            Disconnect
                        </button>
                    )}
                    <Button 
                        onClick={() => handleConnect(platform)}
                        isLoading={isConnecting}
                        className={`px-8! py-3! text-[13px]! font-black! rounded-xl transition-all ${
                            info 
                            ? 'bg-white! text-blue-600! border border-blue-100 hover:bg-blue-50!' 
                            : `${colorClass} text-white! hover:opacity-90`
                        }`}
                    >
                        {info ? 'Reconnect' : 'Connect'}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[20px] p-8 lg:p-10 shadow-sm border border-gray-100 transition-all duration-300">
            <div className="text-start mb-10">
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Social Media Connections</h2>
                <p className="text-[14px] font-medium text-gray-400 mt-1">Connect your social media accounts to automate property postings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderCard('facebook', 'Facebook', 'bg-blue-600')}
                {renderCard('instagram', 'Instagram', 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600')}
                {renderCard('linkedin', 'LinkedIn', 'bg-[#0077b5]')}
                {renderCard('tiktok', 'TikTok', 'bg-black')}
            </div>

            {/* Confirmation Modal */}
            {disconnectingPlatform && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
                                <span className="material-symbols-outlined text-[32px]">warning</span>
                            </div>
                            <h3 className="text-[20px] font-bold text-gray-900 mb-2">Disconnect {disconnectingPlatform.charAt(0).toUpperCase() + disconnectingPlatform.slice(1)}?</h3>
                            <p className="text-[14px] font-medium text-gray-400 mb-8 leading-relaxed">
                                Are you sure you want to disconnect your account? PropAI will no longer be able to automate your property posts to this account.
                            </p>
                            
                            <div className="flex flex-col w-full gap-3">
                                <button 
                                    onClick={handleDisconnect}
                                    disabled={isDisconnecting}
                                    className="w-full bg-red-500 text-white py-3.5 rounded-[14px] text-[15px] font-bold hover:bg-red-600 transition-all duration-200 shadow-md shadow-red-200 disabled:opacity-50"
                                >
                                    {isDisconnecting ? 'Disconnecting...' : `Yes, Disconnect`}
                                </button>
                                <button 
                                    onClick={() => setDisconnectingPlatform(null)}
                                    className="w-full bg-gray-50 text-gray-500 py-3.5 rounded-[14px] text-[15px] font-bold hover:bg-gray-100 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-10 p-6 bg-indigo-50/50 rounded-[22px] border border-indigo-100/30 flex items-start gap-4 transition-all hover:bg-indigo-50">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[24px]">info</span>
                </div>
                <div>
                    <h4 className="text-[14px] font-bold text-indigo-900 mb-1">Important Information</h4>
                    <p className="text-[13px] font-medium text-indigo-700/70 leading-[1.6]">
                        Connecting your account allows PropAI to post property details directly to your pages. Each agent manages their own connections independently and can revoke access at any time via this settings tab or your Meta account.
                    </p>
                </div>
            </div>
        </div>
    );
};
