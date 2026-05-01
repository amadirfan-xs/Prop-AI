'use client';

import React from 'react';
import { useFormikContext } from 'formik';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';

interface CampaignIdentityProps {
    properties: any[];
}

export default function CampaignIdentity({ properties }: CampaignIdentityProps) {
    const { values, errors, touched, handleChange, handleBlur } = useFormikContext<any>();

    return (
        <div className="space-y-10">
            <CampaignNameInput 
                name={values.name} 
                onChange={handleChange} 
                onBlur={handleBlur}
                error={touched.name && errors.name ? String(errors.name) : undefined}
            />
            
            <PropertySelector 
                properties={properties} 
                value={values.propertyId} 
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.propertyId && errors.propertyId ? String(errors.propertyId) : undefined}
            />
        </div>
    );
}

// --- Sub-components ---

function CampaignNameInput({ name, onChange, onBlur, error }: any) {
    return (
        <Input
            label="Campaign Identity"
            name="name"
            value={name}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            placeholder="Enter campaign name..."
            containerClassName="group"
        />
    );
}

function PropertySelector({ properties, value, onChange, onBlur, error }: { 
    properties: any[], 
    value: string, 
    onChange: any, 
    onBlur: any, 
    error?: string 
}) {
    const options = [
        { value: '', label: 'Select a property...' },
        ...properties.map((p: any) => ({ value: String(p.id), label: p.property_title }))
    ];

    return (
        <Select
            label="Select Property"
            name="propertyId"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            options={options}
            error={error}
        />
    );
}
