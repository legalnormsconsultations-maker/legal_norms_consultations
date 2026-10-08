import crypto from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Ensure environment variables are loaded for S3/R2 configuration
const s3Client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT, // Used for Cloudflare R2 or MinIO
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

const DEFAULT_BUCKET = process.env.S3_BUCKET_NAME || "legalnorms-medical-docs";

// Allowed MIME types to prevent malicious uploads (Never trust extensions alone)
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/csv",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

interface UploadConfig {
  fileBuffer: Buffer;
  mimeType: string;
  originalFilename: string;
  isPublic?: boolean;
}

/**
 * Validates the file against system security rules.
 */
function validateFileSecurity(fileBuffer: Buffer, mimeType: string) {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(
      `Security Exception: MIME type ${mimeType} is not permitted.`,
    );
  }

  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `Size Exception: File exceeds maximum allowed size of 50MB.`,
    );
  }

  // Generate SHA-256 Checksum
  const checksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");
  return checksum;
}

/**
 * Uploads a file to object storage and returns metadata for the database.
 */
export async function uploadDocument({
  fileBuffer,
  mimeType,
  originalFilename,
  isPublic = false,
}: UploadConfig) {
  const checksum = validateFileSecurity(fileBuffer, mimeType);

  // Generate a secure, randomized object key to prevent traversal attacks
  const extension = originalFilename
    .split(".")
    .pop()
    ?.replace(/[^a-zA-Z0-9]/g, "");
  const objectKey = `${crypto.randomUUID()}-${Date.now()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: DEFAULT_BUCKET,
    Key: objectKey,
    Body: fileBuffer,
    ContentType: mimeType,
    // Add tagging to integrate with bucket lifecycle policies (e.g., transition to Glacier)
    Tagging: `accessLevel=${isPublic ? "public" : "private"}&scanStatus=pending`,
  });

  await s3Client.send(command);

  return {
    objectKey,
    bucketName: DEFAULT_BUCKET,
    mimeType,
    sizeBytes: fileBuffer.length,
    checksum,
    accessLevel: isPublic ? "public" : "private",
  };
}

/**
 * Generates a time-limited signed URL for securely accessing private documents.
 */
export async function generateSecureDownloadUrl(
  objectKey: string,
  bucketName: string = DEFAULT_BUCKET,
  expiresInSeconds: number = 3600,
) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  // URL expires automatically, strictly enforcing the principle of least privilege
  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Deletes a document from the object storage.
 */
export async function deleteDocument(
  objectKey: string,
  bucketName: string = DEFAULT_BUCKET,
) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  await s3Client.send(command);
}

/**
 * Gets a public CDN url for public files.
 */
export function getPublicUrl(objectKey: string, bucketName: string = DEFAULT_BUCKET) {
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN;
  if (cdnDomain) {
    // Advanced: Use Cloudflare CDN URL
    return `${cdnDomain}/${objectKey}`;
  }
  // Fallback to S3 domain path style or generic url mapping
  return `https://${bucketName}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${objectKey}`;
}
