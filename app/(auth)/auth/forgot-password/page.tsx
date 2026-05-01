import React from 'react';
import AuthMinimalLayout from '@/components/auth/AuthMinimalLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <AuthMinimalLayout>
            <ForgotPasswordForm />
        </AuthMinimalLayout>
    );
}
