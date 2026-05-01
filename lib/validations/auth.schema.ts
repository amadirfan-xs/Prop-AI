import * as Yup from 'yup';
import { 
    LoginFormValues, 
    RegisterFormValues, 
    ForgotPasswordFormValues, 
    ResetPasswordFormValues, 
    VerifyPinFormValues, 
    ChangeTempPasswordFormValues 
} from '@/types/auth';

/**
 * LOGIN FORM
 */
export const loginInitialValues: LoginFormValues = {
    email: '',
    password: '',
};

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Password is required'),
});

/**
 * REGISTER FORM
 */
export const registerInitialValues: RegisterFormValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
};

export const registerSchema = Yup.object({
    fullName: Yup.string()
        .min(2, 'Name is too short')
        .max(150, 'Name is too long')
        .required('Full Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    acceptedTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required(),
});

/**
 * FORGOT PASSWORD FORM
 */
export const forgotPasswordInitialValues: ForgotPasswordFormValues = {
    email: '',
};

export const forgotPasswordSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
});

/**
 * RESET PASSWORD FORM
 */
export const resetPasswordInitialValues: ResetPasswordFormValues = {
    password: '',
    confirmPassword: '',
};

export const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .min(8, 'Minimum 8 characters')
        .matches(/[A-Z]/, 'At least one uppercase letter')
        .matches(/[0-9!@#$%^&*(),.?":{}|<>]/, 'At least one number or symbol')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

/**
 * VERIFY PIN FORM
 */
export const verifyPinInitialValues: VerifyPinFormValues = {
    resetPIN: '',
};

export const verifyPinSchema = Yup.object({
    resetPIN: Yup.string()
        .length(4, 'Must be 4 digits')
        .matches(/^\d+$/, 'Must be numeric')
        .required('Required'),
});

/**
 * CHANGE TEMPORARY PASSWORD FORM
 */
export const changeTempPasswordInitialValues: ChangeTempPasswordFormValues = {
    newPassword: '',
    confirmPassword: '',
};

export const changeTempPasswordSchema = Yup.object({
    newPassword: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your password'),
});
