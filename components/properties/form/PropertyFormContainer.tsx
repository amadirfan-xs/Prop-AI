"use client";

import { useState } from "react";
import Link from "next/link";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";

import PropertyMainForm from "@/components/properties/form/PropertyMainForm";
import PropertyPreviewSidebar from "@/components/properties/form/PropertyPreviewSidebar";
import { Button } from "@/components/common/Button";
import ScheduleSocialMediaModal from "@/components/properties/modals/ScheduleSocialMediaModal";
import apiClient from "@/networking/apiClient";
import { PropertyService } from "@/services/property.service";
import { AiService } from "@/services/ai.service";
import { toastService } from "@/utils/toastService";

import { PropertyFormValues } from "@/types/properties";
import {
  propertyInitialValues,
  propertySchema,
} from "@/lib/validations/property.schema";

export default function PropertyFormContainer() {
  const router = useRouter();
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [createdProperty, setCreatedProperty] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async (values: PropertyFormValues, setFieldValue: any) => {
    if (!values.title || !values.type || !values.city) {
      toastService.info("Please fill in Title, Type, and City first to generate a description.");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await apiClient.request(AiService.generateDescription({
        title: values.title,
        propertyType: values.type,
        beds: Number(values.beds),
        baths: Number(values.baths),
        sqft: Number(values.sqft),
        price: String(values.price),
        city: values.city
      }));

      const description = response.data?.data?.description;
      if (description) {
        setFieldValue("description", description);
        toastService.success("Description generated successfully!");
      }
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      toastService.error("Failed to generate description. Please check your API key.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (values: PropertyFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Create Property
      const propertyData = {
        propertyTitle: values.title,
        propertyDescription: values.description,
        propertyType: values.type,
        askingPriceMonthly: Number(values.price),
        beds: Number(values.beds),
        baths: Number(values.baths),
        totalSqft: Number(values.sqft),
        streetAddress: values.address,
        city: values.city,
        zipCode: values.zipCode,
        listingHighlights: values.listingHighlights
          ? values.listingHighlights.split(',').map((h) => h.trim()).filter((h) => h !== '')
          : [],
      };

      const response = await apiClient.request(
        PropertyService.createProperty(propertyData),
      );
      const propertyId = response.data?.data?.id;

      if (!propertyId) {
        throw new Error("Failed to get property ID from response");
      }

      // 2. Upload Media if exists
      if (values.files && values.files.length > 0) {
        await apiClient.request(
          PropertyService.uploadMedia(propertyId, values.files),
        );
      }

      setCreatedProperty({ id: propertyId, title: values.title });
      setIsSocialModalOpen(true);
    } catch (error: any) {
      console.error("Failed to create property:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create property. Please try again.";
      toastService.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik<PropertyFormValues>
      initialValues={propertyInitialValues}
      validationSchema={propertySchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        setFieldValue,
      }) => (
        <>
          <Form className="space-y-10">
            {/* Header */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* Main Form (Left) */}
              <div className="xl:col-span-8 space-y-10">
                <div>
                  <h1 className="text-[32px] font-black text-gray-900 tracking-tight leading-tight">
                    List New Property
                  </h1>
                  <p className="text-[15px] font-medium text-gray-500 mt-2">
                    Provide the foundational details for your property listing.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-8 lg:p-12 shadow-sm border border-gray-100">
                  <PropertyMainForm
                    values={values}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    onGenerateAI={() => handleGenerateAI(values, setFieldValue)}
                    isGeneratingAI={isGeneratingAI}
                  />
                </div>
                <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <Link
                    href="/properties"
                    className="flex items-center gap-2 text-gray-500 font-black text-[14px] hover:text-gray-900 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">
                      arrow_back
                    </span>
                    Back to List
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isGeneratingAI}
                    className="w-full sm:w-auto px-10 py-5 bg-[#3525CD] text-white rounded-lg font-black text-[15px] hover:bg-[#2A1DA8] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : isGeneratingAI ? "Waiting for AI..." : "Create Property"}
                    <span
                      className={`material-symbols-outlined text-[20px] ${isSubmitting ? "animate-spin" : ""}`}
                    >
                      {isSubmitting ? "progress_activity" : "rocket_launch"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Sidebar Preview (Right) */}
              <div className="xl:col-span-4">
                <div className="sticky top-28">
                  <PropertyPreviewSidebar data={values} />
                </div>
              </div>
            </div>
          </Form>

          {createdProperty && (
            <ScheduleSocialMediaModal
              isOpen={isSocialModalOpen}
              onClose={() => {
                setIsSocialModalOpen(false);
                router.push(`/properties/${createdProperty.id}`);
              }}
              propertyId={createdProperty.id}
              propertyTitle={createdProperty.title}
              propertyDescription={values.description}
              propertyImages={values.files}
            />
          )}
        </>
      )}
    </Formik>
  );
}
