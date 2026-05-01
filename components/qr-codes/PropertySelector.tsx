'use client';

import React from 'react';
import { useFormikContext } from 'formik';
import { Select } from '@/components/common/Select';
import { Property } from '@/types/properties';

interface PropertySelectorProps {
    properties: Property[];
    name: string;
}

interface QRFormValues {
    selectedPropertyId: number | null;
}

export default function PropertySelector({ properties, name }: PropertySelectorProps) {
    const { values, setFieldValue, errors, touched } = useFormikContext<QRFormValues>();

    const options = [
        { value: '', label: 'Choose a property...' },
        ...properties.map(p => ({
            value: p.id.toString(),
            label: `${p.property_title} — ${p.street_address}`
        }))
    ];

    const value = values[name as keyof QRFormValues];

    return (
        <div className="space-y-6">
            <div className="items-center gap-3 hidden md:flex">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-lg md:rounded-2xl flex items-center justify-center text-[#3525CD]">
                    <span className="material-symbols-outlined text-[18px] md:text-[24px]">search</span>
                </div>
                <h2 className="text-[16px] md:text-[18px] font-black text-gray-900">Select Property</h2>
            </div>

            <Select
                label="Property Listing"
                name={name}
                value={value?.toString() || ''}
                onChange={(e) => setFieldValue(name, Number(e.target.value))}
                options={options}
                error={touched[name as keyof QRFormValues] && errors[name as keyof QRFormValues] ? (errors[name as keyof QRFormValues] as string) : undefined}
            />
        </div>
    );
}
