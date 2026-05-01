"use client";

import { Formik, Form } from "formik";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { PropertyService } from "@/services/property.service";
import { useApi } from "@/hooks/useApi";
import { toastService } from "@/utils/toastService";

import { InviteStakeholderFormValues } from "@/types/stakeholder";
import {
  stakeholderInitialValues,
  stakeholderSchema,
} from "@/lib/validations/stakeholder.schema";

interface InviteParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  hasVersions?: boolean;
  consensusStats?: {
    totalSellers: number;
    approvedSellers: number;
    rejectedSellers: number;
    requestChangeSellers: number;
    totalBuyers: number;
    approvedBuyers: number;
    rejectedBuyers: number;
    requestChangeBuyers: number;
    totalRequired: number;
    totalApproved: number;
    hasVetoed: boolean;
  } | null;
  onSuccess?: () => void;
}

export default function InviteParticipantModal({
  isOpen,
  onClose,
  propertyId,
  hasVersions = false,
  consensusStats,
  onSuccess,
}: InviteParticipantModalProps) {
  const { callApi: inviteStakeholderApi, error } = useApi<any>();

  const buyersApproved =
    consensusStats &&
    consensusStats.totalBuyers > 0 &&
    consensusStats.approvedBuyers >
      consensusStats.rejectedBuyers + consensusStats.requestChangeBuyers;
  const sellersAlreadyInvited =
    consensusStats && consensusStats.totalSellers > 0;

  const handleSubmit = async (
    values: InviteStakeholderFormValues,
    { setSubmitting, resetForm }: any,
  ) => {
    try {
      if (values.role === "buyer" && !hasVersions) {
        toastService.error(
          "A purchase contract must be drafted before inviting buyers.",
        );
        setSubmitting(false);
        return;
      }

      if (values.role === "seller" && !buyersApproved) {
        toastService.error(
          "All buyers must approve the contract before inviting sellers.",
        );
        setSubmitting(false);
        return;
      }

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        userTypeId: values.role === "seller" ? 2 : 3,
        userType: "individual",
      };

      const result = await inviteStakeholderApi(
        PropertyService.inviteStakeholder(propertyId, payload),
      );
console.log(error)
      if (!result) {
        throw new Error(
          error || "Failed to send invitation. The user may already be invited or invalid data was provided.",
        );
      }

      await onSuccess?.();
      toastService.success(
        `Invitation sent successfully to the ${values.role}`,
      );
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Invitation error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to send invitation. Please try again.";
      toastService.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <Formik<InviteStakeholderFormValues>
        initialValues={stakeholderInitialValues}
        validationSchema={stakeholderSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form className="p-10 space-y-10">
            {/* Header Text */}
            <div className="text-center space-y-3">
              <h2 className="text-[32px] font-black text-gray-900 tracking-tight">
                Invite Participant
              </h2>
              <p className="text-[17px] font-medium text-gray-400 max-w-[340px] mx-auto leading-relaxed">
                Enter details to invite a buyer or seller to this contract.
              </p>
            </div>

            <div className="space-y-8">
              <Input
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Johnnathan Doe"
                icon={
                  <span className="material-symbols-outlined text-[20px]">
                    person
                  </span>
                }
                className="rounded-[20px] focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                error={touched.name && errors.name}
              />

              {/* Email Address */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="johnnathan@example.com"
                icon={
                  <span className="material-symbols-outlined text-[20px]">
                    mail
                  </span>
                }
                className="rounded-[20px] focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                error={touched.email && errors.email}
              />

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 block ml-0.5">
                  Role Selection
                </label>
                <div className="grid grid-cols-2 p-1.5 bg-[#F8F9FA] rounded-[24px] gap-1.5">
                  <button
                    type="button"
                    disabled={!hasVersions}
                    onClick={() => setFieldValue("role", "buyer")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-[18px] font-black text-[14px] transition-all
                                            ${!hasVersions ? "opacity-40 grayscale cursor-not-allowed" : ""}
                                            ${
                                              values.role === "buyer"
                                                ? "bg-white text-[#4F46E5] shadow-sm ring-1 ring-black/5"
                                                : "text-gray-400 hover:text-gray-600"
                                            }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">
                        shopping_cart
                      </span>
                      Buyer
                    </div>
                    {!hasVersions && (
                      <span className="text-[9px] font-bold text-gray-400">
                        Needs Contract Draft
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={!buyersApproved}
                    onClick={() => setFieldValue("role", "seller")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-[18px] font-black text-[14px] transition-all
                                            ${!buyersApproved ? "opacity-40 grayscale cursor-not-allowed" : ""}
                                            ${
                                              values.role === "seller"
                                                ? "bg-white text-[#4F46E5] shadow-sm ring-1 ring-black/5"
                                                : "text-gray-400 hover:text-gray-600"
                                            }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">
                        local_offer
                      </span>
                      Seller
                    </div>
                    {!buyersApproved && (
                      <span className="text-[9px] font-bold text-gray-400">
                        {consensusStats?.totalBuyers === 0
                          ? "Invite Buyers First"
                          : "Waiting for Buyer Approval"}
                      </span>
                    )}
                  </button>
                </div>
                {touched.role && errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-white border-gray-100 border text-gray-900! font-black text-[15px] hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 shadow-sm"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <span className="flex items-center justify-center gap-2.5">
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                  <span
                    className={`material-symbols-outlined text-[20px] ${!isSubmitting ? "group-hover:translate-x-1" : "animate-spin"} transition-transform`}
                  >
                    {isSubmitting ? "progress_activity" : "send"}
                  </span>
                </span>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
