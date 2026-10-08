/**
 * Asynchronous Processing & Queue Abstraction
 *
 * Uses PostgreSQL-backed jobs table for robust queueing without requiring extra infrastructure.
 */

import { db } from "@/db";
import { backgroundJobs } from "@/db/schema";

export type JobType =
  | "PROCESS_DOCUMENT"
  | "BULK_IMPORT"
  | "SYNC_REGULATORY_DATA"
  | "INDEX_SEARCH"
  | "SEND_EMAIL"
  | "GENERATE_REPORT"
  | "SCAN_FILE_SECURITY";

export interface EnqueueOptions {
  delayMs?: number; // Delay before executing the job
  priority?: number; // Higher number = higher priority
  retries?: number; // Number of times to retry on failure
}

/**
 * Enqueues a job for background processing.
 *
 * @param jobType - The category of the job being dispatched
 * @param payload - The structured data required to execute the job
 * @param options - Queue configurations (delays, retries, etc.)
 */
export async function enqueueBackgroundJob<T = unknown>(
  jobType: JobType,
  payload: T,
  options?: EnqueueOptions,
): Promise<{ jobId: string; status: "queued" }> {
  // Enqueue job to Postgres
  const [newJob] = await db
    .insert(backgroundJobs)
    .values({
      jobType,
      payload,
      maxRetries: options?.retries ?? 3,
    })
    .returning({ id: backgroundJobs.id });

  console.log(`[Queue] Dispatched ${jobType} job (ID: ${newJob.id})`, {
    payload,
    options,
  });

  return {
    jobId: newJob.id,
    status: "queued",
  };
}
