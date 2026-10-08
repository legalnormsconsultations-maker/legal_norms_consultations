import { redirect } from "next/navigation";
import { PortfolioWorkspace } from "@/components/portfolio/portfolio-workspace";
import { db } from "@/db";
import { drugs } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { CatalogService } from "@/services/catalog.service";

export default async function DashboardPortfolioPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const items = await CatalogService.listPortfolio(user);

  const drugList = await db
    .select({ id: drugs.id, name: drugs.drugName })
    .from(drugs);

  return <PortfolioWorkspace initialItems={items} drugList={drugList} />;
}
