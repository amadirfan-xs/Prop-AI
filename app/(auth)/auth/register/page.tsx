import React from 'react';
import RegisterLayout from '@/components/auth/RegisterLayout';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <RegisterLayout>
            <RegisterForm />
        </RegisterLayout>
    );
}
