import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { JobCard } from "@/components/JobCard";
import { JobStatus } from "@prisma/client";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });

  return {
    title: company ? `${company.name} • Remote Job Board` : `Company • ${slug}`,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });

  if (!company) notFound();

  const jobs = await prisma.job.findMany({
    where: {
      companyId: company.id,
      status: JobStatus.ACTIVE,
    },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-[#F7F6F3] min-h-screen">
      <section className="relative overflow-hidden">
        <div className="h-32 bg-slate-900">
          {company.coverUrl ? (
            <Image
              src={company.coverUrl}
              alt={`${company.name} cover`}
              fill
              className="object-cover opacity-90"
            />
          ) : null}
          {/* <div className="absolute inset-0 bg-black/30" /> */}
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-20 pb-10">
          <div className="relative rounded-3xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur-xl p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-3xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-black text-gray-400">
                      {company.name[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900">
                    {company.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                    {company.description || "No company description available."}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                ) : null}
                {company.location ? <div>{company.location}</div> : null}
                {company.industry ? <div>{company.industry}</div> : null}
                {company.size ? <div>{company.size} karyawan</div> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Lowongan dari {company.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {jobs.length} active job{jobs.length === 1 ? "" : "s"} posted
                  by this company.
                </p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
                Belum ada lowongan aktif untuk perusahaan ini.
              </div>
            ) : (
              <div className="grid gap-5">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Informasi Perusahaan
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              {company.website && (
                <div>
                  <p className="font-semibold text-gray-900">Website</p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {company.location && (
                <div>
                  <p className="font-semibold text-gray-900">Lokasi</p>
                  <p>{company.location}</p>
                </div>
              )}
              {company.industry && (
                <div>
                  <p className="font-semibold text-gray-900">Industri</p>
                  <p>{company.industry}</p>
                </div>
              )}
              {company.size && (
                <div>
                  <p className="font-semibold text-gray-900">Ukuran</p>
                  <p>{company.size} karyawan</p>
                </div>
              )}
              {company.twitter && (
                <div>
                  <p className="font-semibold text-gray-900">Twitter</p>
                  <a
                    href={`https://twitter.com/${company.twitter.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @{company.twitter.replace(/^@/, "")}
                  </a>
                </div>
              )}
              {company.linkedin && (
                <div>
                  <p className="font-semibold text-gray-900">LinkedIn</p>
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn profile
                  </a>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tentang</h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {company.description ||
                "Perusahaan ini belum menambahkan deskripsi."}
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
