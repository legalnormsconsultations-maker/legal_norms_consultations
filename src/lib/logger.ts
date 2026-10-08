/**
 * Observability & Structured Logging Abstraction
 *
 * Enforces JSON structured logging and strict correlation/request ID propagation.
 * Acts as the centralized integration point for external tools (e.g. Datadog, Sentry, OpenTelemetry).
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  requestId?: string;
  userId?: string;
  organizationId?: string;
  latencyMs?: number;
  [key: string]: unknown; // Additional context
}

export const Logger = {
  /**
   * Internal formatter enforcing the JSON structured logging constraint
   */
  format(level: LogLevel, payload: LogPayload): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      env: process.env.NODE_ENV || "development",
      ...payload,
    });
  },

  info(payload: LogPayload) {
    // Integration point: Send to Datadog/CloudWatch
    console.log(Logger.format("info", payload));
  },

  warn(payload: LogPayload) {
    console.warn(Logger.format("warn", payload));
  },

  error(error: unknown, payload: LogPayload) {
    // Integration point: Send stack traces to Sentry
    const errorDetails =
      error instanceof Error
        ? { errorMessage: error.message, stack: error.stack }
        : { errorMessage: String(error) };

    console.error(Logger.format("error", { ...payload, ...errorDetails }));
  },

  debug(payload: LogPayload) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(Logger.format("debug", payload));
    }
  },

  /**
   * Performance Tracking Utility
   * Wraps an async function and automatically logs its execution latency.
   */
  async trackLatency<T>(
    operationName: string,
    requestId: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await operation();
      const latencyMs = Math.round(performance.now() - start);

      Logger.info({
        message: `Operation ${operationName} completed successfully.`,
        requestId,
        operationName,
        latencyMs,
      });

      return result;
    } catch (error) {
      const latencyMs = Math.round(performance.now() - start);

      Logger.error(error, {
        message: `Operation ${operationName} failed.`,
        requestId,
        operationName,
        latencyMs,
      });

      throw error;
    }
  },
};
