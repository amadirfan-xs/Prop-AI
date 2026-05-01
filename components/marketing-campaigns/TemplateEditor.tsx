'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const MOCK_TEMPLATES = [
    { id: '1', name: 'Luxury Property Intro', subject: 'Experience the height of luxury at {property_name}', content: 'Hi there,\n\nWe are excited to present {property_name}...' },
    { id: '2', name: 'Viewing Invitation', subject: 'Join us for a private viewing of {property_name}', content: 'You are cordially invited to a private tour...' },
    { id: '3', name: 'Price Update', subject: 'New price for {property_name}', content: 'Good news! The price for {property_name} has been updated...' }
];

export default function TemplateEditor() {
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    const handleTemplateSelect = (id: string) => {
        const template = MOCK_TEMPLATES.find(t => t.id === id);
        if (template) {
            setSelectedTemplateId(id);
            setSubject(template.subject);
            setContent(template.content);
        } else {
            setSelectedTemplateId('');
            setSubject('');
            setContent('');
        }
    };

    return (
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Email Template</h3>
                <div className="flex gap-2">
                    <button className="px-4 h-9 bg-gray-50 text-gray-500 text-[12px] font-black rounded-lg hover:bg-gray-100 transition-all">
                        SAVE AS DRAFT
                    </button>
                    <button className="px-4 h-9 bg-indigo-50 text-[#3525CD] text-[12px] font-black rounded-lg hover:bg-indigo-100 transition-all">
                        VIEW SAVED
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-500 px-1">Select Template</label>
                    <div className="relative group">
                        <select
                            value={selectedTemplateId}
                            onChange={(e) => handleTemplateSelect(e.target.value)}
                            className="w-full h-12 bg-gray-50 border border-transparent rounded-xl px-4 text-[14px] font-bold text-gray-700 appearance-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            <option value="">Start from scratch</option>
                            {MOCK_TEMPLATES.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <div className="border-[#3525CD] border bg-indigo-50/50late-y-1/2 pointer-events-none text-gray-400">
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-500 px-1">Subject Line</label>
                <input
                    type="text"
                    placeholder="Enter email subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-transparent rounded-xl px-4 text-[14px] font-medium text-gray-900 focus:bg-white focus:border-indigo-500 transition-all shadow-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-500 px-1">Email Body</label>
                <div className="rounded-2xl overflow-hidden border border-gray-100 min-h-[300px]">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="h-[250px]"
                    />
                </div>
            </div>
        </div>
    );
}
