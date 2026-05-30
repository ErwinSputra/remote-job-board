import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const {
    name,
    logoUrl,
    coverUrl,
    website,
    description,
    size,
    industry,
    location,
    linkedin,
  } = await request.json();

  if (!name) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 },
    );
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const company = await prisma.company.create({
    data: {
      name,
      slug,
      logoUrl: logoUrl || null,
      coverUrl: coverUrl || null,
      website: website || null,
      description: description || null,
      size: size || null,
      industry: industry || null,
      location: location || null,
      linkedin: linkedin || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(company, { status: 201 });
}
