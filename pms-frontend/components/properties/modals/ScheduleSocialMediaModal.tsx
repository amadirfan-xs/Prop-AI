"use client";

import React, { useEffect } from 'react';
import { Formik, Form, FieldArray, FormikHelpers } from 'formik';
import toast from 'react-hot-toast';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { SOCIAL_MEDIA_PLATFORMS } from '@/constants/properties';
import { useApi } from '@/hooks/useApi';
import { Select } from '@/components/common/Select';
import { PropertyService } from '@/services/property.service';
import { 
    SocialDestination, 
    SocialPlatform, 
    CreateSocialPostPayload, 
    SocialPostResponse,
    SocialPostFormValues
} from '@/types';
import { socialPostSchema, getSocialPostInitialValues } from '@/lib/validations/social.schema';

interface ScheduleSocialMediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
    propertyImages?: Array<File | { originalKey: string, signedUrl: string }>;
    propertyTitle?: string;
    propertyDescription?: string;
    onSuccess?: () => void;
}

const FacebookLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const LinkedInLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const TikTokLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.6-4.03-1.37-.01 3.9-.01 7.8-.02 11.7-.01 2.85-2.26 5.61-5.18 5.69-3.08.13-5.94-2.14-6.1-5.23-.2-4.02 3.63-7.53 7.6-6.3v4.1c-1.39-.51-3.11.13-3.69 1.52-.45 1.08.12 2.51 1.25 2.92 1.12.44 2.54-.15 2.88-1.31.06-.21.07-.43.07-.65V.02z" />
    </svg>
);

const PropertyIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={{
            fontSize: size,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            userSelect: 'none'
        }}
    >
        {name}
    </span>
);

export default function ScheduleSocialMediaModal({
    isOpen,
    onClose,
    propertyId,
    propertyImages,
    propertyTitle,
    propertyDescription,
    onSuccess
}: ScheduleSocialMediaModalProps) {
    const { callApi: fetchDestinations, data: destinations } = useApi<SocialDestination[]>();
    const { callApi: submitPost, loading: isSubmitting } = useApi<SocialPostResponse>();

    useEffect(() => {
        if (isOpen) {
            fetchDestinations(PropertyService.listSocialDestinations());
        }
    }, [isOpen, fetchDestinations]);

    const initialValues = getSocialPostInitialValues(propertyTitle, propertyDescription);
    const defaultDate = new Date().toISOString().split('T')[0];

    const handleSubmit = async (values: SocialPostFormValues, { setSubmitting }: FormikHelpers<SocialPostFormValues>) => {
        if (values.strategy === 'later') {
            const hasPastDate = values.targets.some(t => {
                const scheduledDate = new Date(`${t.scheduleDate}T${t.scheduleTime}`);
                return scheduledDate < new Date();
            });

            if (hasPastDate) {
                toast.error('Scheduled time must be in the future');
                setSubmitting(false);
                return;
            }
        }

        const payload: CreateSocialPostPayload = {
            caption: values.content,
            mode: values.strategy === 'now' ? 'post_now' : 'schedule',
            targets: values.targets.map(t => ({
                platform: t.platform as SocialPlatform,
                socialDestinationId: t.socialDestinationId || (destinations?.find(d => d.platform === t.platform)?.id || undefined),
                scheduledFor: values.strategy === 'later' ? new Date(`${t.scheduleDate}T${t.scheduleTime}`).toISOString() : undefined
            }))
        };

        const result = await submitPost(PropertyService.createSocialPost(propertyId, payload));

        if (result) {
            await onSuccess?.();
            toast.success('Social post processed successfully!');
            onClose();
        }
        setSubmitting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <Formik<SocialPostFormValues>
                initialValues={initialValues}
                validationSchema={socialPostSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting: formikSubmitting, errors, touched }) => (
                    <Form className="flex flex-col h-full max-h-[90vh]">
                        {/* Header - Fixed at top */}
                        <div className="px-10 pt-10 pb-6 bg-white border-b border-gray-50/50 shrink-0">
                            <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">Schedule Social Media Post</h2>
                            <p className="text-[15px] font-medium text-gray-400 mt-2">Select platforms and schedule your property listing</p>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-10 pt-6 space-y-10 custom-scrollbar">

                            {/* Platform Selection */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Platform Selection</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {values.platforms.map((platform, idx) => (
                                        <div
                                            key={platform.id}
                                            onClick={() => {
                                                const newSelected = !platform.isSelected;
                                                setFieldValue(`platforms.${idx}.isSelected`, newSelected);
                                                
                                                if (newSelected) {
                                                    const existingTarget = values.targets.find(t => t.platform === platform.id);
                                                    if (!existingTarget) {
                                                        const defaultTarget = {
                                                            platform: platform.id,
                                                            socialDestinationId: (destinations?.find(d => d.platform === platform.id)?.id || null) as any,
                                                            scheduleDate: values.targets[0]?.scheduleDate || '2023-10-24',
                                                            scheduleTime: values.targets[0]?.scheduleTime || '10:30'
                                                        };
                                                        setFieldValue('targets', [...values.targets, defaultTarget]);
                                                    }
                                                } else {
                                                    setFieldValue('targets', values.targets.filter(t => t.platform !== platform.id));
                                                }
                                            }}
                                            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${platform.isSelected ? 'border-[#3525CD] bg-[#F5F3FF]' : 'border-gray-100 bg-white hover:border-indigo-100'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platform.isSelected ? 'bg-white text-[#3525CD]' : 'bg-[#F7F9FB] text-gray-400'}`}>
                                                {platform.id === 'facebook' && <FacebookLogo />}
                                                {platform.id === 'instagram' && <InstagramLogo />}
                                                {platform.id === 'linkedin' && <LinkedInLogo />}
                                                {platform.id === 'tiktok' && <TikTokLogo />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[15px] font-bold text-gray-900">{platform.name}</h4>
                                                <p className="text-[13px] font-medium text-gray-400">{platform.handle}</p>
                                            </div>
                                            {platform.isSelected && (
                                                <div className="w-6 h-6 bg-[#3525CD] rounded-full flex items-center justify-center text-white">
                                                    <PropertyIcon name="check" size={16} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Editor Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Preview */}
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Post Preview</h3>
                                    <div className="aspect-square bg-[#F7F9FB] rounded-3xl overflow-hidden border border-gray-100 relative shadow-sm">
                                        {propertyImages && propertyImages.length > 0 ? (() => {
                                            const firstMedia = propertyImages[0];
                                            const isVideo = firstMedia instanceof File 
                                                ? firstMedia.type.startsWith('video/')
                                                : firstMedia.originalKey.match(/\.(mp4|mov|avi|wmv)$/i);
                                            
                                            const src = firstMedia instanceof File 
                                                ? URL.createObjectURL(firstMedia) 
                                                : (firstMedia as any).signedUrl;

                                            if (isVideo) {
                                                return (
                                                    <video 
                                                        src={src} 
                                                        className="w-full h-full object-cover" 
                                                        controls
                                                        muted
                                                        autoPlay
                                                        loop
                                                    />
                                                );
                                            }

                                            return (
                                                <img 
                                                    src={src} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            );
                                        })() : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                                                <PropertyIcon name="image" size={48} />
                                                <span className="text-[13px] font-bold">No Image Selected</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Editor */}
                                <div className="space-y-4 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Content Editor</h3>
                                    </div>
                                    <div className="flex-1 min-h-[220px] bg-[#F7F9FB] rounded-[28px] p-7 relative border border-gray-100 focus-within:border-[#B5ABFF] focus-within:bg-white focus-within:shadow-sm transition-all">
                                        <textarea
                                        readOnly
                                            name="content"
                                            value={values.content}
                                            onChange={(e) => setFieldValue('content', e.target.value)}
                                            className="w-full h-full bg-transparent resize-none outline-none text-[15px] text-gray-900 leading-relaxed placeholder:text-gray-400"
                                            placeholder="Write your post content here..."
                                        />
                                        <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between pointer-events-none">
                                            <span className="text-[11px] font-bold text-gray-300 tracking-tight bg-transparent pointer-events-auto">
                                                {values.content.length} / 5,000
                                            </span>
                                            <button
                                                type="button"
                                                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100 pointer-events-auto transition-colors active:scale-90"
                                                aria-label="Add emoji"
                                            >
                                                <PropertyIcon name="sentiment_satisfied" size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scheduling Strategy */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Scheduling Strategy</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[13px] font-medium text-gray-500">Apply same schedule to all platforms</span>
                                        <button
                                        title='Apply same schedule to all platforms'
                                            type="button"
                                            onClick={() => setFieldValue('applyToAll', !values.applyToAll)}
                                            className={`w-11 h-6 rounded-full transition-all relative ${values.applyToAll ? 'bg-[#3525CD]' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${values.applyToAll ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex bg-[#F7F9FB] rounded-2xl p-1.5 border border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setFieldValue('strategy', 'now')}
                                        className={`flex-1 py-3.5 rounded-xl text-[14px] font-black transition-all ${values.strategy === 'now' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Post Now
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFieldValue('strategy', 'later')}
                                        className={`flex-1 py-3.5 rounded-xl text-[14px] font-black transition-all ${values.strategy === 'later' ? 'bg-white text-[#3525CD] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Schedule for Later
                                    </button>
                                </div>

                                {/* Scheduled Lists */}
                                {values.strategy === 'later' && (
                                    <FieldArray name="targets">
                                        {({ push, remove }) => (
                                            <div className="space-y-3">
                                                {values.targets.map((target, index) => (
                                                    <div key={index} className="bg-[#F7F9FB] rounded-2xl p-5 border border-gray-100 flex items-center gap-6 animate-in slide-in-from-top-1 duration-200">
                                                        <div className="flex items-center gap-3 w-40 shrink-0">
                                                            <div className="pt-0.5">
                                                                <Select
                                                                    label="Platform"
                                                                    value={target.platform}
                                                                    onChange={(e) => {
                                                                        const newPlatform = e.target.value as SocialPlatform;
                                                                        setFieldValue(`targets.${index}.platform`, newPlatform);
                                                                    }}
                                                                    options={values.platforms
                                                                        .filter(p => p.isSelected)
                                                                        .map(p => ({ value: p.id, label: p.name }))
                                                                    }
                                                                    containerClassName="mb-0"
                                                                    className="h-[48px] pt-2 pb-2! text-[13px] font-bold"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <Input
                                                                    label="Date"
                                                                    type="date"
                                                                    value={target.scheduleDate}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        if (values.applyToAll) {
                                                                            // Sync date for all rows
                                                                            values.targets.forEach((_, idx) => setFieldValue(`targets.${idx}.scheduleDate`, val));
                                                                        } else {
                                                                            setFieldValue(`targets.${index}.scheduleDate`, val);
                                                                        }
                                                                    }}
                                                                    icon={<PropertyIcon name="calendar_today" size={16} />}
                                                                    containerClassName="mb-0"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <Input
                                                                    label="Time"
                                                                    type="time"
                                                                    value={target.scheduleTime}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        if (values.applyToAll) {
                                                                            // SMART SYNC: Sync time only for DIFFERENT platforms at the same relative position (if possible)
                                                                            // Or simpler: sync all rows that have a DIFFERENT platform from this one, 
                                                                            // preserving other slots on the SAME platform.
                                                                            values.targets.forEach((t, idx) => {
                                                                                if (t.platform !== target.platform) {
                                                                                    // To handle multi-slot correctly: we should only sync rows 
                                                                                    // that are NOT on the same platform to avoid the user's issue.
                                                                                    setFieldValue(`targets.${idx}.scheduleTime`, val);
                                                                                }
                                                                            });
                                                                            // Also update current
                                                                            setFieldValue(`targets.${index}.scheduleTime`, val);
                                                                        } else {
                                                                            setFieldValue(`targets.${index}.scheduleTime`, val);
                                                                        }
                                                                    }}
                                                                    icon={<PropertyIcon name="schedule" size={16} />}
                                                                    containerClassName="mb-0"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center pt-8">
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-rose-50 transition-all border border-gray-100"
                                                                aria-label="Delete schedule"
                                                                disabled={values.targets.length <= 1}
                                                            >
                                                                <PropertyIcon name="delete" size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const lastTarget = values.targets[values.targets.length - 1];
                                                        
                                                        // Calculate next time (+1 hour)
                                                        let nextTime = '11:30';
                                                        if (lastTarget?.scheduleTime) {
                                                            const [hours, minutes] = lastTarget.scheduleTime.split(':').map(Number);
                                                            const nextHour = (hours + 1) % 24;
                                                            nextTime = `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                                        }

                                                        push({
                                                            platform: lastTarget?.platform || values.platforms.find(p => p.isSelected)?.id || 'facebook',
                                                            socialDestinationId: null as any,
                                                            scheduleDate: lastTarget?.scheduleDate || defaultDate,
                                                            scheduleTime: nextTime
                                                        });
                                                    }}
                                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[13px] font-black text-gray-300 hover:text-indigo-400 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 mt-4"
                                                >
                                                    <PropertyIcon name="add" size={18} />
                                                    Add Another Time
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                )}
                            </div>
                        </div>

                        {/* Footer - Fixed at bottom */}
                        <div className="px-10 py-8 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 text-[#3525CD]">
                                <PropertyIcon name="info" size={18} />
                                <p className="text-[13px] font-medium text-gray-500">Auto-cross posting is enabled for these platforms.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button type="button" onClick={onClose} className="w-auto! text-[15px] border-none bg-white hover:bg-gray-50 text-gray-400! transition-colors">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isSubmitting || formikSubmitting}
                                    disabled={values.platforms.filter(p => p.isSelected).length === 0}
                                >
                                    {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}
