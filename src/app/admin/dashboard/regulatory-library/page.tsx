import { redirect } from "next/navigation";
import { RegulatoryLibrary } from "@/components/import-compliance/regulatory-library";
import { getCurrentUser } from "@/lib/auth";
import { RegulatoryLibraryService } from "@/services/regulatory-library.service";

export default async function RegulatoryLibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const resources = await RegulatoryLibraryService.list();

  return <RegulatoryLibrary initialResources={resources} />;
}
