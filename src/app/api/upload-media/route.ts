import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadDocument, getPublicUrl } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.roles.includes("SUPER_ADMIN") && !user.roles.includes("ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    
    let file: File | Blob | null = null;
    let fileName = "";
    for (const [key, value] of formData.entries()) {
      if (value && typeof value === "object" && "arrayBuffer" in value) {
        file = value as Blob;
        fileName = (value as any).name || "uploaded-file";
        break;
      }
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "application/octet-stream";
    
    // Upload securely to R2/S3 (production ready)
    const { objectKey, sizeBytes } = await uploadDocument({
      fileBuffer: buffer,
      mimeType: mimeType,
      originalFilename: fileName,
      isPublic: true, // Content media needs to be public for CDN serving
    });

    // Retrieve high-speed CDN URL
    const publicUrl = getPublicUrl(objectKey);

    return NextResponse.json({ 
      url: publicUrl,
      result: [
        {
          url: publicUrl,
          name: fileName,
          size: sizeBytes
        }
      ]
    }, { status: 200 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
