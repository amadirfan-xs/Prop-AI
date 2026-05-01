import React, { Suspense } from 'react';
import AuthMinimalLayout from '@/components/auth/AuthMinimalLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <AuthMinimalLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthMinimalLayout>
    );
}

