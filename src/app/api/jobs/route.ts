import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Implementation for creating a new job posting
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }
  const {
    title,
    description,
    requirements,
    benefits,
    type,
    category,
    tags,
    experienceLevel,
    region,
    salaryMin,
    salaryMax,
    currency,
    salaryPublic,
    companyId,
  } = await request.json();

  if (!title || !description || !type || !category || !companyId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const job = await prisma.job.create({
    data: {
      title,
      description,
      slug,
      requirements,
      benefits,
      type,
      category,
      tags,
      experienceLevel,
      region,
      salaryMin,
      salaryMax,
      currency,
      salaryPublic,
      companyId,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
