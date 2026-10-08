import { enqueueBackgroundJob } from "@/lib/queue";

export interface IngestionSource {
  name: string;
  externalIdentifier: string;
  retrievalTimestamp: Date;
  version: string;
}

export interface PipelineData<T> {
  source: IngestionSource;
  rawPayload: unknown;
  validatedPayload?: T;
  normalizedData?: T;
  transformationHistory: string[];
}

/**
 * Standardized Regulatory Data Ingestion Pipeline
 *
 * Enforces the strict sequential flow:
 * Fetcher → Validation → Normalization → Deduplication → Transformation → Database → Search Index → Audit Log
 *
 * This class ensures that we never silently overwrite regulatory history and that
 * strict source provenance is maintained for every single ingested record.
 */
export abstract class BaseIngestionPipeline<T> {
  protected source: IngestionSource;

  constructor(source: IngestionSource) {
    this.source = source;
  }

  /**
   * Execute the full pipeline synchronously, or offload heavy portions to queue.
   */
  public async execute(rawPayload: unknown): Promise<void> {
    const pipelineData: PipelineData<T> = {
      source: this.source,
      rawPayload,
      transformationHistory: ["Fetched from Source"],
    };

    try {
      pipelineData.validatedPayload = await this.validate(pipelineData);
      pipelineData.normalizedData = await this.normalize(pipelineData);

      const isDuplicate = await this.deduplicate(pipelineData);
      if (isDuplicate) {
        console.log(
          `[Ingestion] Duplicate detected for ${this.source.externalIdentifier}. Skipping.`,
        );
        return; // Alternatively, generate a versioned update event.
      }

      const finalData = await this.transform(pipelineData);

      await this.persistToDatabase(finalData, pipelineData);

      // Dispatch async jobs for secondary systems (Search, Audit)
      await enqueueBackgroundJob("INDEX_SEARCH", {
        finalData,
        source: this.source,
      });

      await this.auditLog(pipelineData, "SUCCESS");
    } catch (error) {
      console.error(
        `[Ingestion Error] Pipeline failed for ${this.source.externalIdentifier}`,
        error,
      );
      await this.auditLog(pipelineData, "FAILED", error);
      throw error;
    }
  }

  protected abstract validate(data: PipelineData<T>): Promise<T>;
  protected abstract normalize(data: PipelineData<T>): Promise<T>;
  protected abstract deduplicate(data: PipelineData<T>): Promise<boolean>;
  protected abstract transform(data: PipelineData<T>): Promise<unknown>;

  protected abstract persistToDatabase(
    finalData: unknown,
    metadata: PipelineData<T>,
  ): Promise<void>;

  private async auditLog(
    data: PipelineData<T>,
    status: string,
    error?: unknown,
  ): Promise<void> {
    // In reality, this writes to the database audit_logs table
    const errorSummary =
      error instanceof Error ? error.message : error ? String(error) : "none";

    console.log(
      `[Audit] Ingestion ${status}: ${this.source.name} | Identifier: ${this.source.externalIdentifier} | Source: ${data.source.name} | Error: ${errorSummary}`,
    );
  }
}
