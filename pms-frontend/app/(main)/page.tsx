"use client";

import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { activeRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (activeRole === 4)) {
      router.push('/org/dashboard');
    }
  }, [activeRole, isLoading, router]);

  if (isLoading || activeRole === 4) {
    return null; // Or a loading spinner
  }

  return (
    <PortfolioOverview />
  );
}
