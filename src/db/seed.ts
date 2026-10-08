import { config } from "dotenv";

config({ path: ".env.local" });

import { randomUUID } from "node:crypto";

import { db } from "./index";
import { documents, drugs, organizations, users } from "./schema";

async function seed() {
  console.log("🌱 Starting safe database seed operation...");

  const DEMO_ORG_ID = randomUUID();
  const DEMO_USER_ID = randomUUID();

  await db.insert(organizations).values({
    id: DEMO_ORG_ID,
    name: "[DEMO DATA] Legalnorms Development Org",
    slug: "demo-legalnorms-dev",
  });

  await db.insert(users).values({
    id: DEMO_USER_ID,
    email: "demo.admin@legalnorms.com",
    roles: ["PLATFORM_ADMIN"],
    organizationId: DEMO_ORG_ID,
    firstName: "Demo",
    lastName: "Admin",
    organization: "Legalnorms Development Org",
    isActive: true,
  });

  const DEMO_DRUG_ID = randomUUID();

  await db.insert(drugs).values({
    id: DEMO_DRUG_ID,
    drugName: "Aeternum-X",
    genericName: "[FICTIONAL EXAMPLE] Aeternum-X",
    brandName: "VitaMock",
    manufacturer: "[SAMPLE DATA] BioMock Pharmaceuticals",
    status: "INVESTIGATIONAL",
  });

  await db.insert(documents).values({
    id: randomUUID(),
    drugId: DEMO_DRUG_ID,
    authorityId: null,
    title: "[DEMO DATA] Phase II Trial Regulatory Summary",
    documentType: "REGULATORY_DECISION",
    objectKey: "demo/documents/fictional-trial-summary.pdf",
    bucketName: "demo-bucket",
    mimeType: "application/pdf",
    sizeBytes: 1024,
    checksum: "demo-checksum",
    accessLevel: "public",
    version: 1,
    isScanPassed: true,
    publishedDate: new Date(),
  });

  console.log("✅ Seed complete! All demo data safely labeled.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
