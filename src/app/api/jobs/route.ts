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
    isFeatured: rawIsFeatured, // 👈 rename to avoid conflict
    companyId,
  } = await request.json();

  if (!title || !description || !type || !category || !companyId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  const jobCount = await prisma.job.count({
    where: { companyId },
  });

  // get the user's subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === "FREE" && jobCount >= 3) {
    return NextResponse.json(
      { error: "Free plan is limited to 3 active jobs. Upgrade to post more." },
      { status: 403 },
    );
  }

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const isFeatured =
    subscription?.plan === "PREMIUM_POSTER" ? (rawIsFeatured ?? false) : false;

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
      isFeatured,
      featuredUntil: isFeatured
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
