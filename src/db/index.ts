import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import * as schema from "./schema";
import * as consultancySchema from "./consultancy-schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/medical_portfolio";

// Disable prefetch as it is not supported for "Transaction" pool mode
const clientFactory = () =>
  postgres(connectionString, { prepare: false, ssl: "require" });

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const client = globalForDb.client ?? clientFactory();

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema: { ...schema, ...consultancySchema } });
