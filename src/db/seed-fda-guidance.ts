import { db } from "./index";
import { fdaGuidances } from "./schema";

const MOCK_GUIDANCE = {
  title:
    "Artificial Intelligence and Machine Learning (AI/ML)-Enabled Medical Devices: Lifecycle Management",
  type: "Guidance for Industry and FDA Staff",
  status: "Draft",
  center: "CDRH",
  office: "OPEQ",
  topic: "Digital Health, AI/ML, Lifecycle Management",
  docketNumber: "FDA-2024-D-1234",
  issueDate: new Date("2026-10-01T00:00:00Z"),
  commentOpeningDate: new Date("2026-10-01T00:00:00Z"),
  commentClosingDate: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000), // 47 days from now
  supersedes: ["FDA-2021-D-5678"],
  supersededBy: [],
  relatedGuidances: ["FDA-2019-D-0123"],
  officialPdfUrl: "https://www.fda.gov/media/12345/download",
  federalRegisterNoticeUrl:
    "https://www.federalregister.gov/documents/2026/10/01",
  sourceUrl:
    "https://www.fda.gov/regulatory-information/search-fda-guidance-documents",

  aiExecutiveSummary: {
    whatChanged: {
      text: "Introduces a Predetermined Change Control Plan (PCCP) allowing manufacturers to make certain modifications to AI/ML devices without premarket review.",
      citation: "[Section IV.A, Page 12]",
    },
    whyItMatters: {
      text: "Significantly reduces regulatory friction for iterative algorithm updates, potentially accelerating time-to-market for continuous learning systems.",
      citation: "[Executive Summary, Page 2]",
    },
    whoIsAffected: {
      text: "All manufacturers of AI/ML-enabled Software as a Medical Device (SaMD) and Software in a Medical Device (SiMD).",
      citation: "[Section II. Applicability]",
    },
    actionRequired: {
      text: "Sponsors must include a detailed PCCP in future 510(k), De Novo, or PMA submissions to leverage this pathway.",
      citation: "[Section V. Submission Content]",
    },
    deadline: {
      text: "Submit public comments on the draft framework before the comment period closes.",
      citation: "[Federal Register Notice]",
    },
    ifIgnored: {
      text: "Failing to submit a PCCP will require standard premarket review (e.g., new 510(k)) for every algorithmic change that affects safety or effectiveness.",
      citation: "[Section VII. Enforcement]",
    },
  },

  aiDiffAnalysis: [
    {
      area: "Submission Requirement",
      previous: "New 510(k) for all significant changes",
      new: "PCCP permits pre-specified changes without 510(k)",
      impact: "High",
    },
    {
      area: "Data Requirement",
      previous: "Validation data on frozen algorithm",
      new: "Real-world performance monitoring protocols required",
      impact: "Medium",
    },
    {
      area: "Timing",
      previous: "Wait 90 days for 510(k) clearance per change",
      new: "Implement immediately if within approved PCCP bounds",
      impact: "High",
    },
  ],

  aiRegulatoryImpact: [
    {
      function: "Regulatory Affairs",
      impact: "High",
      action: "Draft standardized PCCP templates for upcoming submissions.",
      owner: "Sarah Jenkins",
      deadline: "2026-11-01",
      status: "In Progress",
    },
    {
      function: "Clinical",
      impact: "Medium",
      action: "Establish post-market real-world performance monitoring plans.",
      owner: "Dr. Ahmed Khan",
      deadline: "2026-11-15",
      status: "To Do",
    },
    {
      function: "Quality",
      impact: "High",
      action: "Update QMS to integrate automated PCCP compliance tracking.",
      owner: "Elena Rostova",
      deadline: "2026-12-01",
      status: "To Do",
    },
    {
      function: "R&D / Engineering",
      impact: "High",
      action:
        "Align MLOps pipelines with FDA's algorithmic transparency requirements.",
      owner: "David Chen",
      deadline: "2026-10-30",
      status: "In Progress",
    },
  ],
};

async function main() {
  console.log("Seeding FDA Guidances...");

  try {
    const existing = await db.query.fdaGuidances.findFirst({
      where: (g, { eq }) => eq(g.docketNumber, "FDA-2024-D-1234"),
    });

    if (!existing) {
      await db.insert(fdaGuidances).values(MOCK_GUIDANCE);
      console.log("✅ Seeded FDA-2024-D-1234");
    } else {
      console.log("✅ FDA-2024-D-1234 already exists.");
    }
  } catch (error) {
    console.error("Error seeding FDA Guidances:", error);
  }

  process.exit(0);
}

main();
