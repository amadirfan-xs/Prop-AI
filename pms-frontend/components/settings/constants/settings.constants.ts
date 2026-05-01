import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

// --- Validation Schemas ---

export const ProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Full Name is required'),
    phoneNumber: Yup.string()
        .test('is-valid-phone', 'Invalid phone number', (value) => !value || isValidPhoneNumber(value))
        .nullable(),
    address: Yup.string()
        .nullable(),
    calendlyUrl: Yup.string()
        .url('Invalid URL format')
        .nullable(),
});

export const SecuritySchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
});

export const EmailConfigSchema = Yup.object().shape({
    appName: Yup.string()
        .required('App label is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email address is required'),
    appPassword: Yup.string()
        .required('App password is required')
        .min(16, 'App password should be 16 characters')
        .max(16, 'App password should be 16 characters'),
});

// --- Initial Values ---

export const INITIAL_PROFILE_VALUES = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    calendlyUrl: ''
};

export const INITIAL_SECURITY_VALUES = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
};

export const INITIAL_EMAIL_CONFIG_VALUES = {
    appName: '',
    email: '',
    appPassword: ''
};

// --- Copy & Labels ---

export const SETTINGS_LABELS = {
    PROFILE: {
        TITLE: 'Profile Information',
        SUBTITLE: 'Update your personal details and how others see you.',
        NAME: 'FULL NAME',
        EMAIL: 'EMAIL ADDRESS',
        PHONE: 'PHONE NUMBER',
        ADDRESS: 'ADDRESS',
        CALENDLY: 'CALENDLY BOOKING URL'
    },
    SECURITY: {
        TITLE: 'Security Settings',
        SUBTITLE: 'Manage your credentials and account protection.',
        CURRENT: 'CURRENT PASSWORD',
        NEW: 'NEW PASSWORD',
        CONFIRM: 'CONFIRM NEW PASSWORD'
    },
    EMAIL: {
        TITLE: 'Email Apps',
        SUBTITLE: 'Manage multiple email accounts for your marketing campaigns.',
        APP_LABEL: 'APP LABEL',
        EMAIL_ADDR: 'EMAIL ADDRESS',
        APP_PWD: 'GOOGLE APP PASSWORD'
    }
};

export const SETTINGS_PLACEHOLDERS = {
    NAME: 'Enter your full name',
    EMAIL: 'Enter your email',
    PHONE: 'Enter your phone',
    ADDRESS: 'Enter address',
    CALENDLY: 'calendly.com/your-profile',
    PWD_CURRENT: 'Enter current password',
    PWD_NEW: 'Minimum 8 characters',
    PWD_CONFIRM: 'Repeat new password',
    EMAIL_APP_NAME: 'e.g. Sales Gmail',
    EMAIL_APP_PWD: 'Enter the 16-character app password'
};

