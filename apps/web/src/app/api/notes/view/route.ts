import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "note-views.json");

// Simple Mutex lock to serialize read/write operations and prevent file write concurrency issues
let fileLock = Promise.resolve();

async function readViews(): Promise<Record<string, number>> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or has invalid JSON, fallback to empty record
    return {};
  }
}

async function writeViews(views: Record<string, number>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(views, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const { hashId, viewLimit } = await req.json();

    if (!hashId || typeof viewLimit !== "number") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Acquire lock and execute view count checks sequentially
    const result = await new Promise<{ allowed: boolean; count: number }>((resolve, reject) => {
      fileLock = fileLock
        .then(async () => {
          const views = await readViews();
          const currentCount = views[hashId] || 0;

          if (viewLimit > 0 && currentCount >= viewLimit) {
            resolve({ allowed: false, count: currentCount });
            return;
          }

          const nextCount = currentCount + 1;
          views[hashId] = nextCount;
          await writeViews(views);
          resolve({ allowed: true, count: nextCount });
        })
        .catch((err) => {
          reject(err);
        });
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API View Counter Error:", err);
    return NextResponse.json({ error: "Server error checking views" }, { status: 500 });
  }
}
