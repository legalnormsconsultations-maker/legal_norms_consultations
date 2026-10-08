import { db } from "./src/db";
import { regulatoryResources } from "./src/db/schema";

const resources = [
  {
    authority: "CDSCO",
    category: "Drugs & biologics",
    title: "Central Drugs Standard Control Organisation",
    description:
      "Primary portal for central drug, biological, medical-device, and import-related notices and services.",
    url: "https://cdsco.gov.in/opencms/opencms/en/Home/",
  },
  {
    authority: "CDSCO SUGAM",
    category: "Applications",
    title: "SUGAM online services",
    description:
      "Starting point for current online applications, registrations, permissions, and user guidance.",
    url: "https://cdscoonline.gov.in/CDSCO/homepage",
  },
  {
    authority: "FSSAI",
    category: "Food & nutraceuticals",
    title: "Food Safety and Standards Authority of India",
    description:
      "Food-category rules, licensing references, import requirements, and official notices.",
    url: "https://www.fssai.gov.in/",
  },
  {
    authority: "FSSAI FICS",
    category: "Food imports",
    title: "Food Import Clearance System",
    description:
      "Official starting point for food-import clearance status and related processes.",
    url: "https://fics.fssai.gov.in/",
  },
  {
    authority: "DGFT",
    category: "Importer setup",
    title: "Directorate General of Foreign Trade",
    description:
      "Importer-exporter code services and trade-policy notifications.",
    url: "https://www.dgft.gov.in/CP/",
  },
  {
    authority: "CPCB",
    category: "EPR & environment",
    title: "Central Pollution Control Board",
    description:
      "EPR portals, registrations, and compliance information for covered waste streams.",
    url: "https://cpcb.nic.in/",
  },
  {
    authority: "BIS",
    category: "Standards & certification",
    title: "Bureau of Indian Standards",
    description:
      "Indian Standards, conformity assessment, product certification, and scheme information.",
    url: "https://www.bis.gov.in/",
  },
  {
    authority: "WPC / DoT",
    category: "Wireless products",
    title: "Saral Sanchar portal",
    description:
      "Department of Telecommunications online services; verify the current WPC equipment-approval route here.",
    url: "https://saralsanchar.gov.in/",
  },
  {
    authority: "Consumer Affairs",
    category: "Legal metrology",
    title: "Department of Consumer Affairs",
    description:
      "Legal Metrology legislation, packaged-commodity rules, and official notifications.",
    url: "https://consumeraffairs.nic.in/",
  },
  {
    authority: "CBN",
    category: "Controlled substances",
    title: "Central Bureau of Narcotics",
    description:
      "Primary source for controlled-substance administration, permissions, and current notices.",
    url: "https://cbn.nic.in/",
  },
  {
    authority: "Ministry of AYUSH",
    category: "AYUSH",
    title: "Ministry of AYUSH",
    description:
      "Official ministry information, schemes, and notices relevant to traditional medicine systems.",
    url: "https://ayush.gov.in/",
  },
  {
    authority: "DSIR",
    category: "Research organizations",
    title: "Department of Scientific and Industrial Research",
    description:
      "Official recognition and research-industry program information for eligible organizations.",
    url: "https://dsir.gov.in/",
  },
];

async function main() {
  await db.insert(regulatoryResources).values(resources);
  console.log("Seeded regulatory library");
  process.exit(0);
}

main().catch(console.error);
