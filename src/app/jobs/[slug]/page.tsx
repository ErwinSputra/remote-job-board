import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatSalary } from "@/lib/utils";
import { Bookmark, Building2, Globe, MapPin, Users } from "lucide-react";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await prisma.job.findUnique({ where: { slug } });
  return {
    title: job ? `${job.title} • Remote Job Board` : `Job • ${slug}`,
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;

  const job = await prisma.job.findUnique({
    where: { slug },
    include: { company: true },
  });

  if (!job) notFound();

  const similarJobs = await prisma.job.findMany({
    where: {
      category: job.category,
      slug: { not: slug },
      status: "ACTIVE",
    },
    include: { company: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  const typeLabel: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship",
  };

  return (
    <main className="bg-[#F7F6F3] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8 items-start">
        {/* ── Left Column ── */}
        <div className="flex-1 space-y-4">
          {/* 1. Header Card */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              {/* Logo */}
              <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                {job.company.logoUrl ? (
                  <Image
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-400">
                    {job.company.name[0]}
                  </span>
                )}
              </div>

              {/* Title + Meta */}
              <div className="flex-1">
                <h1 className="text-xl font-black text-gray-900 leading-snug mb-1">
                  {job.title}
                </h1>
                <Link
                  href={`/companies/${job.company.slug}`}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  {job.company.name}
                </Link>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#1A1A2E] text-white">
                    {typeLabel[job.type] ?? job.type}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-600">
                    {job.category}
                  </span>
                  {job.region && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-600">
                      🌍 {job.region}
                    </span>
                  )}
                  {salary && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      💰 {salary}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button className="bg-[#FFE97D] hover:bg-[#FDD835] transition-colors text-[#1A1A2E] font-bold px-6 py-2.5 rounded-full text-sm cursor-pointer">
                Lamar Sekarang
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-4 py-2.5 rounded-full hover:border-gray-400 transition-colors cursor-pointer">
                <Bookmark size={14} />
                Simpan
              </button>
            </div>
          </section>

          {/* 2. Content Section */}
          <section className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-3">
                Deskripsi Pekerjaan
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  Kualifikasi
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  Benefit
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.benefits}
                </p>
              </div>
            )}

            {/* Tags */}
            {job.tags.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 3. Company Section */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Tentang Perusahaan
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {job.company.logoUrl ? (
                  <Image
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-400">
                    {job.company.name[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">{job.company.name}</p>
              </div>
            </div>

            {job.company.description && (
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {job.company.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {job.company.industry && (
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  <span>{job.company.industry}</span>
                </div>
              )}
              {job.company.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>{job.company.location}</span>
                </div>
              )}
              {job.company.size && (
                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span>{job.company.size} karyawan</span>
                </div>
              )}
              {job.company.website && (
                <div className="flex items-center gap-1.5">
                  <Globe size={14} />

                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Right Column ── */}
        <div className="w-72 shrink-0 space-y-4 sticky top-6">
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              Lowongan Serupa
            </h2>
            {similarJobs.length === 0 ? (
              <p className="text-xs text-gray-400">
                Tidak ada lowongan serupa saat ini.
              </p>
            ) : (
              <div className="space-y-3">
                {similarJobs.map((j) => (
                  <Link
                    key={j.id}
                    href={`/jobs/${j.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {j.company.logoUrl ? (
                        <Image
                          src={j.company.logoUrl}
                          alt={j.company.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-400">
                          {j.company.name[0]}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {j.title}
                      </p>
                      <p className="text-xs text-gray-400">{j.company.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
