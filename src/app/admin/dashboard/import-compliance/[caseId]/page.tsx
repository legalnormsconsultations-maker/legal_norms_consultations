import { notFound, redirect } from "next/navigation";
import { ImportComplianceCaseDetail } from "@/components/import-compliance/import-compliance-case-detail";
import { getCurrentUser } from "@/lib/auth";
import { getImportComplianceCase } from "@/services/import-compliance.service";

export default async function ImportComplianceCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { caseId } = await params;
  const complianceCase = await getImportComplianceCase(user, caseId);
  if (!complianceCase) notFound();

  return <ImportComplianceCaseDetail initialCase={complianceCase} />;
}
