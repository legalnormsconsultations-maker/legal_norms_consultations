import { redirect } from "next/navigation";
import { ImportComplianceWorkspace } from "@/components/import-compliance/import-compliance-workspace";
import { getCurrentUser } from "@/lib/auth";
import { listImportComplianceCases } from "@/services/import-compliance.service";

export default async function ImportCompliancePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const cases = await listImportComplianceCases(user);

  return <ImportComplianceWorkspace initialCases={cases} />;
}
