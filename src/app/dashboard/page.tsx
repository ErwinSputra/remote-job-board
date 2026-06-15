import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Manage your job postings, company profile, and subscription.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/");

  const company = await prisma.company.findFirst({
    where: { userId: session.user.id },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!company) redirect("/companies/create");

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { plan: true },
  });

  return (
    <DashboardClient
      company={company}
      jobs={company.jobs}
      isPremium={subscription?.plan === "PREMIUM_POSTER"}
    />
  );
}
