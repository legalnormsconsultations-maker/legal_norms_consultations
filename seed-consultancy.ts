import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authorities, services, articles, leads, products } from "./src/db/consultancy-schema";
import { v4 as uuidv4 } from "uuid";

const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/medical_portfolio";
const sql = postgres(connectionString, { max: 1, ssl: "require" });
const db = drizzle(sql);

async function main() {
  console.log("Seeding consultancy data...");
  
  await db.delete(leads);
  await db.delete(articles);
  await db.delete(services);
  await db.delete(authorities);

  // 1. Seed Authorities
  const [cdsco] = await db.insert(authorities).values([
    {
      name: "CDSCO (Central Drugs Standard Control Organization)",
      jurisdiction: "India",
      notes: "National Regulatory Authority of India for pharmaceuticals and medical devices.",
      officialWebsite: "https://cdsco.gov.in"
    }
  ]).returning();

  const [fssai] = await db.insert(authorities).values([
    {
      name: "FSSAI (Food Safety and Standards Authority of India)",
      jurisdiction: "India",
      notes: "Statutory body established under the Ministry of Health & Family Welfare.",
      officialWebsite: "https://fssai.gov.in"
    }
  ]).returning();

  console.log("Seeded authorities.");

  // 2. Seed Services
  const [mdService] = await db.insert(services).values([
    {
      name: "Medical Device Registration",
      slug: "medical-device-registration",
      category: "Registration",
      authorityId: cdsco.id,
      shortDescription: "Complete lifecycle management for Medical Device (MD-15) and In-Vitro Diagnostics.",
      description: "Our team helps you navigate the complex Medical Device Rules 2017 to secure import or manufacturing licenses. We handle dossier preparation, query responses, and post-market compliance.",
      estimatedTimeline: "3-6 months"
    }
  ]).returning();

  const [cosmeticService] = await db.insert(services).values([
    {
      name: "Cosmetics Import Registration",
      slug: "cosmetics-import-registration",
      category: "Import License",
      authorityId: cdsco.id,
      shortDescription: "End-to-end guidance for Form 43 submissions via SUGAM portal.",
      description: "Secure your cosmetic import registration smoothly. We assist with reviewing labeling compliance, organizing master files, and submitting via the SUGAM portal.",
      estimatedTimeline: "2-4 months"
    }
  ]).returning();

  const [foodService] = await db.insert(services).values([
    {
      name: "FSSAI Central License",
      slug: "fssai-central-license",
      category: "License",
      authorityId: fssai.id,
      shortDescription: "Central licensing for large-scale manufacturers, importers, and exporters.",
      description: "Get your central food license for proprietary foods, novel foods, or large manufacturing units. We handle the FoSCoS application start to finish.",
      estimatedTimeline: "1-2 months"
    }
  ]).returning();

  console.log("Seeded services.");

  // 3. Seed Articles (Knowledge Base)
  await db.insert(articles).values([
    {
      title: "Understanding CDSCO Medical Device Classification",
      slug: "understanding-cdsco-medical-device-classification",
      type: "Guide",
      status: "Published",
      authorityId: cdsco.id,
      excerpt: "A comprehensive guide on how India categorizes medical devices into classes A, B, C, and D based on risk.",
      content: "<p>The Medical Device Rules (MDR) 2017 classify medical devices based on their intended use and risk profile.</p><ul><li>Class A: Low Risk</li><li>Class B: Low-Moderate Risk</li><li>Class C: Moderate-High Risk</li><li>Class D: High Risk</li></ul><p>Proper classification is the most critical first step before applying for a license.</p>",
      publishedAt: new Date(),
      readingTime: 5,
      seoTitle: "CDSCO Medical Device Classification Guide | RegulaCore",
      seoDescription: "Learn how the CDSCO classifies medical devices in India and determine your compliance requirements."
    },
    {
      title: "Latest Updates to FSSAI Labeling Regulations 2026",
      slug: "fssai-labeling-regulations-2026",
      type: "Update",
      status: "Published",
      authorityId: fssai.id,
      excerpt: "Recent notifications on front-of-pack labeling and nutritional claims for packaged foods.",
      content: "<p>FSSAI has introduced new guidelines for front-of-pack labeling (FOPL) to help consumers make informed choices. Ensure your new packaging designs comply before the deadline.</p>",
      publishedAt: new Date(),
      readingTime: 3
    }
  ]);

  console.log("Seeded articles.");

  // 4. Seed Leads
  await db.insert(leads).values([
    {
      serviceId: mdService.id,
      fullName: "Dr. Alice Smith",
      email: "alice.smith@medtechco.example.com",
      mobileNumber: "+919876543210",
      company: "MedTech Co",
      message: "Looking for assistance registering a Class C orthopedic implant.",
      status: "New",
      sourceUrl: "Website",
    },
    {
      serviceId: foodService.id,
      fullName: "Raj Patel",
      email: "raj@organicfoods.example.in",
      mobileNumber: "+919988776655",
      company: "Organic Foods India",
      message: "Need a central license for importing organic juices.",
      status: "Contacted",
      sourceUrl: "Referral",
    }
  ]);

  console.log("Seeded leads.");

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
