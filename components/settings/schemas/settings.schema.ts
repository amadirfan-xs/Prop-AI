import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

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
