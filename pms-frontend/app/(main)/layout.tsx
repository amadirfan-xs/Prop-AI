import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
