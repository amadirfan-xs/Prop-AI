"use client";

import React, { useEffect } from 'react';
import { useFormik, FormikProvider } from 'formik';
import { Input } from '@/components/common/Input';
import { PhoneInputComponent } from '@/components/common/PhoneInput';
import { Button } from '@/components/common/Button';
import { ProfileSchema, INITIAL_PROFILE_VALUES, SETTINGS_LABELS, SETTINGS_PLACEHOLDERS } from '../constants/settings.constants';
import { getInitials, getProfilePictureUrl } from '../utils/settings.utils';
import { User } from '@/types/auth';
import ProfileService from '@/services/profile.service';
import { toastService } from '@/utils/toastService';
import { useApi } from '@/hooks/useApi';

interface ProfileTabProps {
    user: User | null;
    refreshUser: () => Promise<void>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, refreshUser }) => {
    const { callApi: updateProfileApi, error: profileError, reset: resetProfileApi } = useApi();
    const { callApi: uploadAvatarApi, error: avatarError, reset: resetAvatarApi } = useApi();
    
    useEffect(() => {
        if (profileError) {
            toastService.error(profileError);
        }
    }, [profileError]);

    useEffect(() => {
        if (avatarError) {
            toastService.error(avatarError);
        }
    }, [avatarError]);

    const formik = useFormik({
        initialValues: {
            ...INITIAL_PROFILE_VALUES,
            name: user?.name || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            address: user?.address || '',
            calendlyUrl: user?.calendlyUrl || ''
        },
        enableReinitialize: true,
        validationSchema: ProfileSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (!formik.dirty) {
                toastService.info("No changes detected.");
                setSubmitting(false);
                return;
            }
            try {
                resetProfileApi();
                const response = await updateProfileApi(ProfileService.updateProfile({
                    name: values.name,
                    phoneNumber: values.phoneNumber,
                    address: values.address,
                    calendlyUrl: values.calendlyUrl
                }));
                
                if (response) {
                    await refreshUser();
                    toastService.success("Profile updated successfully!");
                }
            } catch (error) {
                console.error("Update failed", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        try {
            resetAvatarApi();
            const response = await uploadAvatarApi(ProfileService.uploadAvatar(e.target.files[0]));
            if (response) {
                await refreshUser();
                toastService.success("Avatar updated!");
            }
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    return (
        <div className="bg-white rounded-[20px] p-8 lg:p-10 shadow-sm border border-gray-100 transition-all duration-300">
            <div className="text-start mb-8">
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{SETTINGS_LABELS.PROFILE.TITLE}</h2>
                <p className="text-[14px] font-medium text-gray-400 mt-1">{SETTINGS_LABELS.PROFILE.SUBTITLE}</p>
            </div>

            <div className="flex items-center gap-6 mb-12">
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-lg border-2 border-white bg-[#1A1A1A] flex items-center justify-center text-white text-3xl font-bold">
                        {user?.profilePictureUrl ? (
                            <img
                                src={getProfilePictureUrl(user.profilePictureUrl) || ''}
                                alt={user.name}
                                className="w-full h-full object-cover opacity-90"
                            />
                        ) : (
                            getInitials(user?.name)
                        )}
                    </div>
                    <label className="absolute -bottom-1 -right-2 w-9 h-9 bg-white rounded-xl shadow-xl flex items-center justify-center text-[#3525CD] border border-gray-100 hover:scale-110 transition-transform cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                </div>
                <div className="text-start">
                    <h3 className="text-[22px] font-bold text-gray-900 leading-tight">{user?.name || "Loading..."}</h3>
                    <p className="text-[15px] font-medium text-gray-500 mt-0.5">{user?.email || "loading..."}</p>
                </div>
            </div>

            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                    <Input
                        label={SETTINGS_LABELS.PROFILE.NAME}
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name}
                        placeholder={SETTINGS_PLACEHOLDERS.NAME}
                    />
                    <Input
                        label={SETTINGS_LABELS.PROFILE.EMAIL}
                        name="email"
                        value={formik.values.email}
                        disabled
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={SETTINGS_PLACEHOLDERS.EMAIL}
                    />
                    <PhoneInputComponent
                        label={SETTINGS_LABELS.PROFILE.PHONE}
                        name="phoneNumber"
                        placeholder={SETTINGS_PLACEHOLDERS.PHONE}
                    />
                    <div className="md:col-span-2">
                        <Input
                            label={SETTINGS_LABELS.PROFILE.ADDRESS}
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && formik.errors.address}
                            placeholder={SETTINGS_PLACEHOLDERS.ADDRESS}
                        />
                    </div>
                    {(user?.primaryRole === 1 || user?.primaryRole === 5) && (
                        <div className="md:col-span-2">
                            <Input
                                label={SETTINGS_LABELS.PROFILE.CALENDLY}
                                name="calendlyUrl"
                                value={formik.values.calendlyUrl}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.calendlyUrl && formik.errors.calendlyUrl}
                                placeholder={SETTINGS_PLACEHOLDERS.CALENDLY}
                            />
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-10 border-t border-gray-50 mt-10 md:col-span-2">
                        <Button 
                            type="submit"
                            isLoading={formik.isSubmitting}
                            className="!w-full sm:!w-auto !bg-[#3323CC] !py-5 !px-24 !text-[15px] !font-black !rounded-[18px] !shadow-xl !shadow-indigo-100 group"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </FormikProvider>
        </div>
    );
};
