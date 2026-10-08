import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standardized API Error Types
 */
export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId: string;
  };
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    nextCursor?: string;
  };
};

/**
 * Standardized Error Handler for API Routes
 *
 * Ensures all API errors adhere to a strict contract and never leak
 * raw database errors or stack traces to the client.
 */
export function handleApiError(
  error: unknown,
  req: Request,
): NextResponse<ApiErrorResponse> {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

  // Handle Validation Errors (Zod)
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The provided request data is invalid.",
          details: error.format(),
          requestId,
        },
      },
      { status: 400 },
    );
  }

  // Handle Known Business/Authorization Errors (Example mapping)
  if (error instanceof Error) {
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication is required to access this resource.",
            requestId,
          },
        },
        { status: 401 },
      );
    }

    if (error.message.includes("Forbidden")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to access this resource.",
            requestId,
          },
        },
        { status: 403 },
      );
    }
  }

  // Fallback for unhandled server errors (Do not leak internal messages)
  console.error(`[API Error | RequestID: ${requestId}]`, error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while processing the request.",
        requestId,
      },
    },
    { status: 500 },
  );
}

/**
 * Standardized Success Response Wrapper
 */
export function createApiResponse<T>(
  data: T,
  meta?: ApiSuccessResponse<T>["meta"],
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta,
  });
}
