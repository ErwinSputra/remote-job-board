import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

// -----------------------------------------------------------------------------
// FILE UPLOAD API ROUTE
// -----------------------------------------------------------------------------
// Accepts a single image file via multipart/form-data, validates it server-side
// (type, size), uploads it to the "company-logos" Supabase Storage bucket, and
// returns the public URL to store in the database (e.g. Company.logoUrl).
const BUCKET_NAME = "company-logos";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export async function POST(req: NextRequest) {
  // 1. AUTH CHECK
  // Only EMPLOYER or ADMIN can upload company logos.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. PARSE THE INCOMING FILE
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // 3. VALIDATE FILE TYPE
  // Never trust the file extension alone — check the actual MIME type reported
  // by the browser. This is the server-side check the front-end can't bypass.
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: PNG, JPEG, WEBP, SVG." },
      { status: 400 },
    );
  }

  // 4. VALIDATE FILE SIZE
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Max size is 2MB." },
      { status: 400 },
    );
  }

  // 5. BUILD A SAFE, UNIQUE FILE PATH
  // Prefixing with the user's ID avoids collisions between different users
  // uploading files with the same name (e.g. two people uploading "logo.png").
  const fileExt = file.name.split(".").pop();
  const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
  console.log(fileName);

  // 6. UPLOAD TO SUPABASE STORAGE
  const fileBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 },
    );
  }

  // 7. GET THE PUBLIC URL
  // Since the bucket is public, this returns a permanent, directly-accessible URL.
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}
