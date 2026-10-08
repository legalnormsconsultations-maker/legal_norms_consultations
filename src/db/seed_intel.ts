import { db } from "@/db";
import { regulatoryIntelligence } from "@/db/schema";

async function main() {
  await db.insert(regulatoryIntelligence).values([
    {
      title: "FDA Guidance Update",
      dateString: "Today",
      status: "Critical",
    },
    {
      title: "EMA Safety Alert",
      dateString: "Yesterday",
      status: "Warning",
    },
    {
      title: "New Drug Application (NDA) Trends",
      dateString: "This Week",
      status: "Info",
    },
  ]);
  console.log("Seeded regulatory intelligence");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
