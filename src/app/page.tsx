import JobCard from "@/components/JobCard";
import { prisma } from "@/lib/prisma";
import { Briefcase } from "lucide-react";
import { JobType } from "@prisma/client";
import { ExperienceLevel } from "@prisma/client";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPills } from "@/components/CategoryPills";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find the Best Remote Jobs",
  description:
    "Browse remote job opportunities across software engineering, design, marketing, and more. New jobs added daily.",
  openGraph: {
    title: "Find the Best Remote Jobs — RemoteJobs",
    description:
      "Browse remote job opportunities across software engineering, design, marketing, and more. New jobs added daily.",
    url: "https://yourdomain.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the Best Remote Jobs — RemoteJobs",
    description:
      "Browse remote job opportunities across software engineering, design, marketing, and more. New jobs added daily.",
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string;
    type?: string;
    category?: string;
    experienceLevel?: string;
  };
}) {
  const { q, type, category, experienceLevel } = await searchParams;

  const jobs = await prisma.job.findMany({
    where: {
      title: q ? { contains: q, mode: "insensitive" } : undefined,
      type: type ? (type as JobType) : undefined,
      experienceLevel: experienceLevel
        ? (experienceLevel as ExperienceLevel)
        : undefined,
      category: category
        ? { contains: category, mode: "insensitive" }
        : undefined,
    },
    include: { company: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const featuredCount = jobs.filter((j) => j.isFeatured).length;
  const categories = [...new Set(jobs.map((j) => j.category))];

  return (
    <main className="min-h-screen bg-[#F4F4F5]">
      {/* ── Hero ── */}
      <section className="bg-[#1A1A2E] text-white px-6 py-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            Find Your Best <span className="text-[#FFE97D]">Remote Job</span>
          </h1>
          <p className="text-white/50 text-sm mb-6">
            {jobs.length} active jobs · {featuredCount} featured
          </p>
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* ── Category pills ── */}
      <section className="bg-white border-b border-gray-200 px-6 py-4 overflow-x-auto">
        <Suspense fallback={null}>
          <CategoryPills categories={categories} />
        </Suspense>
      </section>

      {/* ── Job listings ── */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Featured section */}
          {featuredCount > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  ⭐ Featured
                </span>
                <div className="flex-1 h-px bg-amber-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs
                  .filter((j) => j.isFeatured)
                  .map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
              </div>
            </div>
          )}

          {/* All jobs section */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                All Jobs
              </span>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">
                {jobs.filter((j) => !j.isFeatured).length} jobs
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs
                .filter((j) => !j.isFeatured)
                .map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
            </div>
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No jobs available yet</p>
              <p className="text-sm mt-1">Check back later.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
