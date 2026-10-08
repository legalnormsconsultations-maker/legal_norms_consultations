import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  auditLogs,
  documents,
  drugs,
  regulatoryEvents,
  users,
} from "../db/schema";

export class AdminRepository {
  async getAllAuditLogs() {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
  }

  async getAllDrugs() {
    return await db.select().from(drugs).orderBy(desc(drugs.createdAt));
  }

  async getAllUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllRegulatoryEvents() {
    return await db
      .select()
      .from(regulatoryEvents)
      .orderBy(desc(regulatoryEvents.createdAt));
  }

  async getAllDocuments() {
    return await db.select().from(documents).orderBy(desc(documents.createdAt));
  }
}
