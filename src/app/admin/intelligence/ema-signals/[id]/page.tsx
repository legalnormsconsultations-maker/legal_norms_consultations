import EmaSignalClient from "./EmaSignalClient";
import { RegulatorySignalsRepository } from "@/repositories/regulatory-signals-repository";

export const metadata = {
  title: "EMA PRAC Safety Signal | Medical Portfolio",
  description:
    "View EMA PRAC safety signal details, risk profiles, and regulatory action trackers.",
};

const defaultSeedData = {
  referenceId: "EMA-PRAC-2026-001",
  substanceName: "Ozempic (semaglutide)",
  riskDescription: "Increased risk of severe gastrointestinal paralysis (gastroparesis)",
  affectedPopulation: "Adult patients with type 2 diabetes and long-term use",
  regulatoryAction: "SmPC and Package Leaflet Update",
  currentStatus: "Implementation",
  timeline: [
    { stage: "Signal detected", status: "completed", date: "Jan 12, 2026", evidence: "Spontaneous reports from EudraVigilance" },
    { stage: "Assessment", status: "completed", date: "Feb 05, 2026", evidence: "PRAC Rapporteur preliminary review" },
    { stage: "PRAC review", status: "completed", date: "Mar 15, 2026", evidence: "Detailed pharmacovigilance assessment" },
    { stage: "PRAC recommendation", status: "completed", date: "Apr 20, 2026", evidence: "Recommendation to update SmPC Section 4.4 and 4.8" },
    { stage: "CHMP / regulatory opinion", status: "completed", date: "May 10, 2026", evidence: "Endorsement of PRAC recommendations" },
    { stage: "Product information update", status: "in-progress", date: "Jun 01, 2026", evidence: "MAHs updating labels" },
    { stage: "Implementation", status: "pending", date: "Expected Jul 2026", evidence: "National competent authorities review" },
    { stage: "Monitoring", status: "pending", date: "Ongoing", evidence: "Enhanced surveillance in PSURs" },
  ],
  riskProfile: {
    type: "Adverse Drug Reaction (ADR)",
    severity: "Severe (can lead to hospitalization)",
    frequency: "Rare (≥1/10,000 to <1/1,000)",
    populationAffected: "Primarily females, age 45-65",
    doseRelationship: "Observed at doses ≥1mg weekly",
    ageGroup: "Adults",
    contraindications: "Patients with a history of severe gastrointestinal motility disorders",
    warnings: "Use with caution in patients with existing gastrointestinal disease",
    monitoringRequirements: "Monitor for persistent nausea, vomiting, and abdominal pain",
    benefitRiskImpact: "Benefit-risk balance remains positive, but requires strict warning",
  },
  productInfoChange: {
    section: "SmPC Section 4.4 - Special warnings and precautions for use",
    before: "Gastrointestinal events\nUse of GLP-1 receptor agonists may be associated with gastrointestinal adverse reactions. Patients should be advised of the potential risk of dehydration in relation to gastrointestinal side effects and take precautions to avoid fluid depletion.",
    after: 'Gastrointestinal events\nUse of GLP-1 receptor agonists may be associated with gastrointestinal adverse reactions. <mark class="bg-yellow-200 text-yellow-900 px-1 rounded font-medium">Cases of delayed gastric emptying (gastroparesis) have been reported, some of which were severe and required medical intervention.</mark> Patients should be advised of the potential risk of dehydration in relation to gastrointestinal side effects and take precautions to avoid fluid depletion. <mark class="bg-yellow-200 text-yellow-900 px-1 rounded font-medium">If gastroparesis is suspected, treatment should be paused or discontinued and the patient further evaluated.</mark>',
    type: "warning",
  },
  evidence: {
    signalSource: "EudraVigilance database and external literature",
    evidenceType: "Observational post-marketing data",
    adverseEventEvidence: "152 serious spontaneous reports globally",
    literatureEvidence: "2 published epidemiological studies indicating a 2.5x higher risk vs DPP-4 inhibitors",
    clinicalTrialEvidence: "Not clearly identified in original phase 3 trials due to limited duration",
    postMarketingEvidence: "Significant signal-to-noise ratio increase in the last 18 months",
    regulatoryAssessment: "Strong biological plausibility based on GLP-1 mechanism of action",
    remainingUncertainty: "Exact incidence rate in general population remains unknown; confounding factors like diabetic neuropathy exist.",
  },
  actionTracker: [
    { action: "Label update required", status: "Completed", date: "May 25, 2026" },
    { action: "Risk communication (DHPC)", status: "Submitted", date: "Jun 02, 2026" },
    { action: "Additional study (PASS)", status: "In Progress", date: "Due Q4 2026" },
    { action: "PSUR-related follow-up", status: "Not Started", date: "Due Feb 2027" },
  ],
};

export default async function EmaSignalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let signalData = await RegulatorySignalsRepository.getSignalById(params.id);

  // Auto-seed if navigating to the demo ID and it doesn't exist yet
  if (!signalData && params.id === "EMA-PRAC-2026-001") {
    signalData = await RegulatorySignalsRepository.upsertSignal(defaultSeedData);
  }

  if (!signalData) {
    return <div className="p-8 text-center">Signal not found in database.</div>;
  }

  return <EmaSignalClient initialData={signalData} />;
}
