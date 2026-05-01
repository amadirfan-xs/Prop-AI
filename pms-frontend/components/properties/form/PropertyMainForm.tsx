"use client";

import React from 'react';
import PropertyMediaUpload from '@/components/properties/form/PropertyMediaUpload';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { SparklesIcon } from '@/constants/icons/DashboardIcons';
interface PropertyMainFormProps {
    values: any;
    errors: any;
    touched: any;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    onGenerateAI?: () => void;
    isGeneratingAI?: boolean;
}

export default function PropertyMainForm({
    values,
    errors,
    touched,
    onChange,
    onBlur,
    setFieldValue,
    onGenerateAI,
    isGeneratingAI
}: PropertyMainFormProps) {
    return (
        <div className="space-y-8">
            {/* Title */}
            <Input
                label="Property Title"
                name="title"
                value={values.title}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="e.g. Modern Penthouse with Skyline View"
                error={touched.title && errors.title}
            />

            {/* Description */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Description</label>
                    <button
                        type="button"
                        onClick={onGenerateAI}
                        disabled={isGeneratingAI}
                        className={`flex items-center gap-1.5 px-4 py-2 cursor-pointer text-[#7C3AED] rounded-md text-[11px] font-black hover:bg-violet-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-wait`}
                    >
                        <SparklesIcon size={16} color="" className={`${isGeneratingAI ? 'animate-spin' : 'animate-pulse text-amber-500'}`} />
                        {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>
                <div className="relative">
                    <textarea
                        name="description"
                        value={values.description}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={6}
                        placeholder="Describe the property features, neighborhood, and amenities..."
                        className={`w-full bg-[#f7f8f9] border rounded-[10px] py-6 px-8 text-[15px] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none ${touched.description && errors.description ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}`}
                    />
                </div>
                <div className="flex items-center justify-between px-2">
                    <div>
                        {touched.description && errors.description && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.description}</p>
                        )}
                    </div>
                    <span className="text-[11px] font-bold text-gray-300 tracking-tighter uppercase whitespace-nowrap">
                        {values.description?.length || 0} / 15,000 CHARACTERS
                    </span>
                </div>
            </div>

            {/* Type & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Type</label>
                    <div className="relative">
                        <select
                            name="type"
                            value={values.type}
                            onChange={onChange}
                            onBlur={onBlur}
                            title="Property Type"
                            className="w-full bg-[#f7f8f9] border border-gray-200 rounded-[10px] py-4 pt-5 px-6 text-[15px] text-gray-900 focus:ring-2 focus:ring-[#5b51e0] outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>Residential Apartment</option>
                            <option>Commercial Office</option>
                            <option>Luxury Villa</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                    </div>
                </div>
                <Input
                    label="Price"
                    name="price"
                    value={values.price}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="4,500"
                    icon={<span className="font-bold">$</span>}
                    error={touched.price && errors.price}
                />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Input
                    label="Beds"
                    name="beds"
                    value={values.beds}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="3"
                    className="text-center"
                    error={touched.beds && errors.beds}
                />
                <Input
                    label="Baths"
                    name="baths"
                    value={values.baths}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="2"
                    className="text-center"
                    error={touched.baths && errors.baths}
                />
                <Input
                    label="Total Sqft"
                    name="sqft"
                    value={values.sqft}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="1,200"
                    className="text-center"
                    error={touched.sqft && errors.sqft}
                />
            </div>

            {/* Address */}
            <Input
                label="Street Address"
                name="address"
                value={values.address}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="123 Architectural Way"
                error={touched.address && errors.address}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                    label="City"
                    name="city"
                    value={values.city}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="San Francisco"
                    error={touched.city && errors.city}
                />
                <Input
                    label="Zip Code"
                    name="zipCode"
                    value={values.zipCode}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="94103"
                    error={touched.zipCode && errors.zipCode}
                />
            </div>

            <Input
                label="Listing Highlights"
                name="listingHighlights"
                value={values.listingHighlights}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="e.g. Ocean View, Smart Home, Fully Furnished (comma separated)"
                error={touched.listingHighlights && errors.listingHighlights}
            />

            {/* Media Upload */}
            <div className="pt-6">
                <PropertyMediaUpload
                    files={values.files}
                    setFieldValue={setFieldValue}
                    error={touched.files && errors.files as string}
                />
            </div>
        </div>
    );
}
