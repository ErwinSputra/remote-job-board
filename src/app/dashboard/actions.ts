"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteJob(jobId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const job = await prisma.job.findFirst({
    where: { id: jobId, company: { userId: session.user.id } },
  });
  if (!job) throw new Error("Not found or unauthorized");

  await prisma.job.delete({ where: { id: jobId } });
  revalidatePath("/dashboard");
}

export async function updateCompany(
  companyId: string,
  data: {
    name: string;
    description?: string | null;
    website?: string | null;
    location?: string | null;
    industry?: string | null;
    size?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
  },
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const company = await prisma.company.findFirst({
    where: { id: companyId, userId: session.user.id },
  });
  if (!company) throw new Error("Not found or unauthorized");

  await prisma.company.update({ where: { id: companyId }, data });
  revalidatePath("/dashboard");
}

import { JobType, ExperienceLevel, JobStatus } from "@prisma/client";

export async function updateJob(
  jobId: string,
  data: {
    title: string;
    description: string;
    requirements?: string | null;
    benefits?: string | null;
    type: string;
    category: string;
    tags: string[];
    experienceLevel: string;
    region?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency: string;
    salaryPublic: boolean;
    status: string;
  },
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const job = await prisma.job.findFirst({
    where: { id: jobId, company: { userId: session.user.id } },
  });
  if (!job) throw new Error("Not found or unauthorized");

  await prisma.job.update({
    where: { id: jobId },
    data: {
      ...data,
      type: data.type as JobType,
      experienceLevel: data.experienceLevel as ExperienceLevel,
      status: data.status as JobStatus,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/jobs/${job.slug}`);
}
