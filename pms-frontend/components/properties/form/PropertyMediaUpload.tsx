"use client";

import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/common/Button';

const PropertyIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={{
            fontSize: size,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            userSelect: 'none'
        }}
    >
        {name}
    </span>
);

interface PropertyMediaUploadProps {
    files: File[];
    setFieldValue: (field: string, value: any) => void;
    error?: string;
}

export default function PropertyMediaUpload({ files = [], setFieldValue, error }: PropertyMediaUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));
        const invalidFilesCount = selectedFiles.length - validFiles.length;

        if (invalidFilesCount > 0) {
            toast.error(`Skipped ${invalidFilesCount} invalid files. Allowed types: JPG, PNG, WEBP`);
        }

        if (validFiles.length > 0) {
            const totalFiles = [...files, ...validFiles];
            setFieldValue('files', totalFiles.slice(0, 10)); // Limit to 10 files
        }

        // Reset input so the same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFieldValue('files', updatedFiles);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[16px] font-bold text-gray-900">Property Media</h3>
                    <p className="text-[13px] font-medium text-gray-400 mt-1">Upload high-quality images to attract more leads.</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-[#3525CD] rounded-full text-[10px] font-black tracking-widest uppercase">
                    {files.length}/10 Uploaded
                </span>
            </div>

            <input
                title='files'
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
            />

            {files.length === 0 ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-100 rounded-lg p-12 flex flex-col items-center justify-center bg-[#FDFDFF] group hover:border-indigo-200 transition-all cursor-pointer"
                >
                    <div className="w-16 h-16 bg-[#EEF2FF] text-[#3525CD] rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <PropertyIcon name="cloud_upload" size={32} />
                    </div>
                    <h4 className="text-[16px] font-bold text-gray-900 mb-2">Drag and drop images here</h4>
                    <p className="text-[13px] font-medium text-gray-400 mb-8">Support for JPG, PNG, WEBP (Max 10MB each)</p>
                    <Button type='button' className="w-auto! px-10 py-3.5 border border-gray-200 text-gray-900 rounded-lg font-bold text-[13px] cursor-pointer transition-all shadow-sm">
                        Browse Files
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 shadow-sm bg-gray-50">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
                                >
                                    { }    <PropertyIcon name="delete" size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {files.length < 10 && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center bg-[#FDFDFF] hover:border-indigo-200 transition-all cursor-pointer text-[#3525CD]"
                        >
                            <PropertyIcon name="add" size={24} />
                            <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Add More</span>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 mt-2 px-2">
                    <PropertyIcon name="error" size={14} className="text-red-500" />
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{error}</p>
                </div>
            )}
        </div>
    );
}
