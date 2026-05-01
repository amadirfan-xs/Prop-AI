"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Property } from "@/types/properties";
import apiClient from "@/networking/apiClient";

const InquirySchema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  message: Yup.string().required("Required"),
});

export default function InquiryFormSection({
  property,
}: {
  property: Property;
}) {
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      message: "",
    },
    validationSchema: InquirySchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await apiClient.post(
          `/api/public/property/${property.id}/inquiry`,
          values,
        );
        toast.success("Inquiry sent successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to send inquiry. Please try again.");
      }
    },
  });

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-[#F8F9FF] rounded-[32px] md:rounded-[48px] p-8 md:p-14 lg:p-24 overflow-hidden relative"
      >
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-indigo-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="space-y-8 md:space-y-10">
            <div className="space-y-4">
              <span className="text-[#3525CD] text-[12px] font-black uppercase tracking-[0.2em]">
                Contact Us
              </span>
              <h2 className="text-[36px] md:text-[56px] font-black text-gray-900 leading-[1.1] tracking-tight">
                Register Your <br className="hidden md:block" /> Interest
              </h2>
              <p className="text-[16px] md:text-[18px] text-gray-600 font-medium max-w-md">
                Exclusive private viewings for{" "}
                <span className="font-black text-[#3525CD]">
                  {property.property_title}
                </span>{" "}
                are available by appointment only. Contact our luxury specialist
                to schedule your visit.
              </p>
            </div>

            <div className="space-y-6 md:space-y-8 pt-4 md:pt-0">
              <motion.a
                href={`tel:${property.agent?.phone_number || ""}`}
                whileHover={{ x: 5 }}
                className="flex items-center gap-5 md:gap-6 group cursor-pointer"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center text-[#3525CD] group-hover:bg-[#3525CD] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                    call
                  </span>
                </div>
                <div>
                  <p className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Phone
                  </p>
                  <p className="text-[16px] md:text-[18px] font-bold text-gray-900">
                    {property.agent?.phone_number || "N/A"}
                  </p>
                </div>
              </motion.a>

              <motion.a
                href={`mailto:${property.agent?.email || ""}`}
                whileHover={{ x: 5 }}
                className="flex items-center gap-5  md:gap-6 group cursor-pointer"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center text-[#3525CD] group-hover:bg-[#3525CD] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                    mail
                  </span>
                </div>
                <div>
                  <p className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Email
                  </p>
                  <p className="text-[16px] md:text-[18px] font-bold text-gray-900">
                    {property.agent?.email || "N/A"}
                  </p>
                </div>
              </motion.a>

              {property.agent?.calendly_url && (
                <motion.a
                  href={property.agent.calendly_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-5 md:gap-6 group cursor-pointer"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-[#3525CD] rounded-xl md:rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white group-hover:bg-[#2A1DA6] transition-all">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                      calendar_month
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-[12px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">
                      Schedule
                    </p>
                    <p className="text-[16px] md:text-[18px] font-bold text-gray-900">
                      Book a Meeting
                    </p>
                  </div>
                </motion.a>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-10 lg:p-14 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-indigo-200/40 space-y-8"
          >
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-6 md:space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[12px] font-black text-gray-700 uppercase tracking-widest px-1">
                    First Name
                  </label>
                  <input
                    name="first_name"
                    placeholder="John"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.first_name}
                    className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-xl px-5 md:px-6 text-[14px] md:text-[15px] focus:ring-2 focus:ring-[#3525CD] transition-all"
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <div className="text-red-500 text-[10px] uppercase font-bold px-1">
                      {formik.errors.first_name}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[12px] font-black text-gray-700 uppercase tracking-widest px-1">
                    Last Name
                  </label>
                  <input
                    name="last_name"
                    placeholder="Doe"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.last_name}
                    className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-xl px-5 md:px-6 text-[14px] md:text-[15px] focus:ring-2 focus:ring-[#3525CD] transition-all"
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <div className="text-red-500 text-[10px] uppercase font-bold px-1">
                      {formik.errors.last_name}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] md:text-[12px] font-black text-gray-700 uppercase tracking-widest px-1">
                  Email Address
                </label>
                <input
                  name="email"
                  placeholder="Ex: john@luxury.com"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-xl px-5 md:px-6 text-[14px] md:text-[15px] focus:ring-2 focus:ring-[#3525CD] transition-all"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-[10px] uppercase font-bold px-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] md:text-[12px] font-black text-gray-700 uppercase tracking-widest px-1">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder={`I am interested in ${property.property_title}...`}
                  rows={3}
                  onChange={formik.handleChange}
                  value={formik.values.message}
                  className=" w-full bg-gray-50 border-none rounded-xl p-5 md:p-6 text-[14px] md:text-[15px] focus:ring-2 focus:ring-[#3525CD] transition-all resize-none"
                ></textarea>
                {formik.touched.message && formik.errors.message && (
                  <div className="text-red-500 text-[10px] uppercase font-bold px-1">
                    {formik.errors.message}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-4 md:py-5 bg-[#3525CD] text-white text-[12px] md:text-[13px] font-black rounded-xl uppercase tracking-widest hover:bg-[#2A1DA6] transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
              >
                {formik.isSubmitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
