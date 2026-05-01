import React from 'react';
import QRManagerContainer from '@/components/qr-codes/QRManagerContainer';

export const metadata = {
    title: 'Property QR Code Generator | PropArchitect',
    description: 'Generate and manage secure QR codes for property access.',
};

export default function QRCodesPage() {
    return <QRManagerContainer />;
}
