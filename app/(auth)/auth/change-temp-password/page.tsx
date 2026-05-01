import React from 'react';
import AuthMinimalLayout from '@/components/auth/AuthMinimalLayout';
import ChangeTempPasswordForm from '@/components/auth/ChangeTempPasswordForm';

export default function ChangeTempPasswordPage() {
    return (
        <AuthMinimalLayout>
            <ChangeTempPasswordForm />
        </AuthMinimalLayout>
    );
}
