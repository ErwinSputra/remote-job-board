import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        include: { company: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(savedJobs);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await request.json();
  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: session.user.id, jobId } },
  });

  if (existing) {
    await prisma.savedJob.delete({
      where: { userId_jobId: { userId: session.user.id, jobId } },
    });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedJob.create({
    data: { userId: session.user.id, jobId },
  });

  return NextResponse.json({ saved: true });
}
