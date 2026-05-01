'use client';

import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';

interface Step3Props {
    recipientsCount: number;
    emailConfigs: any[];
    onLaunch: () => void;
    isLaunching: boolean;
}

export default function StepLaunchSchedule({ recipientsCount, emailConfigs, onLaunch, isLaunching }: Step3Props) {
    const { values, setFieldValue, errors, touched } = useFormikContext<any>();

    const handleScheduleChange = (type: 'now' | 'later') => {
        setFieldValue('scheduleType', type);
        if (type === 'now') {
            setFieldValue('scheduledAt', null);
        }
    };

    const handleDateTimeChange = (date?: string, time?: string) => {
        const d = date || values.scheduledAt?.split('T')[0] || '';
        const t = time || values.scheduledAt?.split('T')[1]?.slice(0, 5) || '12:00';
        if (d) {
            setFieldValue('scheduledAt', `${d}T${t}:00Z`);
        }
    };

    const emailOptions = [
        { value: '', label: 'Select an email app...' },
        ...emailConfigs.map(config => ({
            value: String(config.id),
            label: `${config.appName} (${config.email})`
        }))
    ];

    const scheduleType = values.scheduleType;

    return (
        <div className="max-w-[900px] mx-auto space-y-12">
            <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-xl space-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -mr-32 -mt-32"></div>

                <div className="relative space-y-2">
                    <h3 className="text-[24px] font-black text-gray-900 leading-tight">Ready to Launch?</h3>
                    <p className="text-[14px] font-medium text-gray-400">Review your campaign settings before broadcasting.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Campaign Audience</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[24px] font-black text-[#3525CD] leading-none">{recipientsCount}</span>
                                <span className="text-[13px] font-bold text-gray-400">Verified Emails</span>
                            </div>
                        </div>
                        
                        <Select
                            label="Sending From (App)"
                            name="emailConfigId"
                            value={values.emailConfigId}
                            onChange={(e) => setFieldValue('emailConfigId', e.target.value)}
                            options={emailOptions}
                            error={touched.emailConfigId && errors.emailConfigId ? String(errors.emailConfigId) : undefined}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Email Subject</p>
                            <p className="text-[15px] font-bold text-gray-700 italic">"{values.subject || 'No Subject'}"</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Spam-Check Passed</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-50"></div>

                {/* Scheduling Logic */}
                <div className="space-y-8">
                    <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-widest leading-none text-center">Execution Schedule</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleScheduleChange('now')}
                            className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${scheduleType === 'now'
                                ? 'border-[#3525CD] border bg-indigo-50/50'
                                : 'border-gray-50 border bg-white hover:border-gray-200'
                                }`}
                        >
                            <span className={`text-[14px] font-black ${scheduleType === 'now' ? 'text-[#3525CD]' : 'text-gray-900'}`}>Send Immediately</span>
                            <span className="text-[11px] font-bold text-gray-400">Broadcast within 60 seconds</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleScheduleChange('later')}
                            className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${scheduleType === 'later'
                                ? 'border-[#3525CD] border bg-indigo-50/50'
                                : 'border-gray-50 border bg-white hover:border-gray-200'
                                }`}
                        >
                            <span className={`text-[14px] font-black ${scheduleType === 'later' ? 'text-[#3525CD]' : 'text-gray-900'}`}>Schedule for Later</span>
                            <span className="text-[11px] font-bold text-gray-400">Pick a custom date and time</span>
                        </button>
                    </div>

                    {scheduleType === 'later' && (
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex-1 space-y-2">
                                    <label htmlFor="schedule-date" className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Delivery Date</label>
                                    <input 
                                        id="schedule-date" 
                                        title="Delivery Date" 
                                        type="date" 
                                        value={values.scheduledAt?.split('T')[0] || ''}
                                        onChange={(e) => handleDateTimeChange(e.target.value)}
                                        className={`w-full h-14 bg-gray-50 border-none rounded-xl px-6 text-[14px] font-bold text-gray-900 ${errors.scheduledAt ? 'ring-2 ring-red-100' : ''}`} 
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label htmlFor="schedule-time" className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Time (UTC)</label>
                                    <input 
                                        id="schedule-time" 
                                        title="Delivery Time" 
                                        type="time" 
                                        value={values.scheduledAt?.split('T')[1]?.slice(0, 5) || ''}
                                        onChange={(e) => handleDateTimeChange(undefined, e.target.value)}
                                        className={`w-full h-14 bg-gray-50 border-none rounded-xl px-6 text-[14px] font-bold text-gray-900 ${errors.scheduledAt ? 'ring-2 ring-red-100' : ''}`} 
                                    />
                                </div>
                            </div>
                            {errors.scheduledAt && (
                                <p className="text-[12px] font-bold text-red-500 px-2 animate-in fade-in duration-300">{String(errors.scheduledAt)}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="pt-8">
                    <Button 
                        onClick={onLaunch}
                        isLoading={isLaunching}
                        className="!w-full !h-16 !bg-[#3525CD] !text-white !text-[15px] !font-black !rounded-[20px] hover:!bg-[#2A1DA6] !shadow-2xl !shadow-indigo-200"
                    >
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined">{isLaunching ? 'sync' : 'rocket_launch'}</span>
                            <span>{isLaunching ? 'LAUNCHING...' : (scheduleType === 'now' ? 'LAUNCH CAMPAIGN NOW' : 'SCHEDULE CAMPAIGN')}</span>
                        </div>
                    </Button>
                </div>
            </div>

            <p className="text-[12px] font-medium text-gray-400 text-center px-12 leading-relaxed">
                By launching this campaign, you agree to our <span className="text-indigo-500 font-bold underline cursor-pointer">anti-spam policy</span>.
                System will automatically track bounce rate and open metrics.
            </p>
        </div>
    );
}
