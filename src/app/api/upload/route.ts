import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL!;

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized — please log in to the admin panel first." }, { status: 401 });
  }

  // Validate R2 environment variables before attempting upload
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;

  if (!accountId || !accessKey || !secretKey || !bucketName || !publicUrl) {
    const missing = [
      !accountId && "CLOUDFLARE_ACCOUNT_ID",
      !accessKey && "CLOUDFLARE_R2_ACCESS_KEY_ID",
      !secretKey && "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
      !bucketName && "CLOUDFLARE_R2_BUCKET_NAME",
      !publicUrl && "NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL",
    ].filter(Boolean);
    return NextResponse.json(
      { error: `R2 storage not configured. Missing: ${missing.join(", ")}` },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Could not parse form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000",
      })
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] R2 error:", msg);
    return NextResponse.json({ error: `Upload failed: ${msg}` }, { status: 500 });
  }

  return NextResponse.json({ url: `${PUBLIC_URL}/${key}` });
}
