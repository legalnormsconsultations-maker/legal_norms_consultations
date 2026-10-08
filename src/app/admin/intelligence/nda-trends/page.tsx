import { Metadata } from "next";
import { NdaTrendsClient } from "./nda-trends-client";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NdaTrendsRepository } from "@/repositories/nda-trends-repository";

export const metadata: Metadata = {
  title: "NDA & Drug Approval Intelligence | Legalnorms",
  description: "Real-time analytics and predictive insights into FDA approval trends.",
};

export default async function NdaTrendsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  // Fetch real aggregated data from our database
  const dashboardData = await NdaTrendsRepository.getDashboardData();

  return <NdaTrendsClient initialData={dashboardData} />;
}
