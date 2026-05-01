import React, { Suspense } from 'react';
import AuthMinimalLayout from '@/components/auth/AuthMinimalLayout';
import VerifyPinForm from '@/components/auth/VerifyPinForm';

export default function VerifyPinPage() {
    return (
        <AuthMinimalLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyPinForm />
            </Suspense>
        </AuthMinimalLayout>
    );
}
