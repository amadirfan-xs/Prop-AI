"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useFormikContext } from "formik";
import CampaignIdentity from "@/components/marketing-campaigns/CampaignIdentity";
import EmailLivePreview from "@/components/marketing-campaigns/EmailLivePreview";
import { Select } from "@/components/common/Select";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Step1Props {
  properties: any[];
  templates: any[];
}

export default function StepTemplateEditor({
  properties,
  templates,
}: Step1Props) {
  const { values, setFieldValue, handleChange } = useFormikContext<any>();

  const handleTemplateSelect = (id: string) => {
    const template = templates.find((t) => String(t.id) === String(id));
    if (template) {
      setFieldValue("selectedTemplateId", id);
      setFieldValue("subject", template.subject);
      setFieldValue("content", template.content);
    }
  };

  const selectedProperty = properties.find(
    (p) => String(p.id) === String(values.propertyId),
  );
  const propertyTitle = selectedProperty?.property_title || "Select a property";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
      {/* Left: Editor */}
      <div className="space-y-12">
        <CampaignIdentity properties={properties} />

        <div className="space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
          <TemplateSelector
            templates={templates}
            onSelect={handleTemplateSelect}
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-500 px-1 uppercase tracking-widest">
                Subject Line
              </label>
              <input
                suppressHydrationWarning={true}
                type="text"
                name="subject"
                title="Subject Line"
                value={values.subject}
                onChange={handleChange}
                placeholder="Enter email subject..."
                className="w-full h-14 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl px-6 text-[15px] font-bold text-gray-900 transition-all"
              />
            </div>

            <EmailEditor
              value={values.content}
              onChange={(val: string) => setFieldValue("content", val)}
            />
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="xl:sticky xl:top-24 h-fit">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-2xl bg-emerald-500 animate-pulse"></div>
          <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">
            Live Preview
          </span>
        </div>
        <EmailLivePreview
          subject={values.subject.replace(/{property_name}/g, propertyTitle)}
          content={values.content.replace(/{property_name}/g, propertyTitle)}
          propertyName={propertyTitle}
        />
      </div>
    </div>
  );
}

// --- Sub-components ---

function TemplateSelector({
  templates,
  onSelect,
}: {
  templates: any[];
  onSelect: (id: string) => void;
}) {
  const options = [
    ...templates.map((t) => ({ value: String(t.id), label: t.name })),
  ];

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
        Template Content
      </h3>
      <Select
        label="" // Hidden via styling if needed or just empty
        name="templateLoader"
        options={options}
        onChange={(e) => onSelect(e.target.value)}
        containerClassName="!mb-0"
        className="!py-2 !h-auto !bg-indigo-50 !text-[#3525CD] !font-black !rounded-lg"
      />
    </div>
  );
}

function EmailEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-black text-gray-500 px-1 uppercase tracking-widest">
        Email Body
      </label>
      <div className="rounded-2xl overflow-hidden border border-gray-100 min-h-[400px]">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          className="h-[340px] text-black"
        />
      </div>
    </div>
  );
}
