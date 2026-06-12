import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in request." },
        { status: 400 }
      );
    }

    // Validate type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not supported. Only images and PDFs are allowed.` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 5MB limit.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileUrl = "";
    const isVercel = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.NETLIFY);
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    // Generate unique name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${sanitizedOriginal}`;

    if (isVercel && hasBlobToken) {
      // Production path: Upload to Vercel Blob
      try {
        const blobResult = await put(`uploads/${filename}`, buffer, {
          access: "public",
          contentType: file.type,
        });
        fileUrl = blobResult.url;
      } catch (blobErr: any) {
        console.error("Vercel Blob Upload Failed:", blobErr);
        // Fall back to base64 if it's small enough, otherwise throw
        if (file.size <= 1.5 * 1024 * 1024) {
          const base64Data = buffer.toString("base64");
          fileUrl = `data:${file.type};base64,${base64Data}`;
        } else {
          return NextResponse.json(
            { error: `Vercel Blob upload failed. Error: ${blobErr.message || blobErr}` },
            { status: 500 }
          );
        }
      }
    } else if (isVercel) {
      // Production path without Vercel Blob configured: use base64 for small files, error for large files
      if (file.size <= 1.5 * 1024 * 1024) {
        const base64Data = buffer.toString("base64");
        fileUrl = `data:${file.type};base64,${base64Data}`;
      } else {
        return NextResponse.json(
          { 
            error: "Vercel Blob storage is not configured (missing BLOB_READ_WRITE_TOKEN env var). " +
                   "Files larger than 1.5MB cannot be shared without configuring Vercel Blob storage. " +
                   "Please link a Vercel Blob Store to this project in the Vercel dashboard."
          },
          { status: 400 }
        );
      }
    } else {
      // Local development or custom server path: write to local disk
      try {
        // Create public/uploads folder if it doesn't exist
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const filePath = path.join(UPLOAD_DIR, filename);
        // Write file to disk
        await fs.writeFile(filePath, buffer);
        fileUrl = `/uploads/${filename}`;
      } catch (fsErr: any) {
        console.error("Local Filesystem write failed:", fsErr);
        // Fallback to base64 just in case local permissions are broken
        if (file.size <= 1.5 * 1024 * 1024) {
          const base64Data = buffer.toString("base64");
          fileUrl = `data:${file.type};base64,${base64Data}`;
        } else {
          throw fsErr;
        }
      }
    }

    // Parse PDF page count if applicable
    let pages = 0;
    if (file.type === "application/pdf") {
      try {
        const text = new TextDecoder("latin1").decode(bytes);
        const pageMatches = text.match(/\/Type\s*\/Page\b/g);
        pages = pageMatches ? pageMatches.length : 0;
        
        if (pages === 0) {
          const countMatches = text.match(/\/Count\s+(\d+)/);
          if (countMatches && countMatches[1]) {
            pages = parseInt(countMatches[1]);
          }
        }
      } catch (e) {
        console.warn("Failed to parse PDF pages count:", e);
      }
    }

    return NextResponse.json({
      success: true,
      name: file.name,
      url: fileUrl,
      type: file.type.startsWith("image/") ? "image" : "pdf",
      size: file.size,
      ...(pages > 0 ? { pages } : {}),
    });
  } catch (err: any) {
    console.error("API File Upload Error:", err);
    return NextResponse.json(
      { error: "Failed to upload file due to server error." },
      { status: 500 }
    );
  }
}
