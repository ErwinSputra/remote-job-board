import { JobCard } from "@/components/JobCard";
import { prisma } from "@/lib/prisma";
import { Briefcase, MapPin, TrendingUp } from "lucide-react";

export default async function Home() {
  const jobs = await prisma.job.findMany({
    include: { company: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const featuredCount = jobs.filter((j) => j.isFeatured).length;
  const categories = [...new Set(jobs.map((j) => j.category))];

  return (
    <main className="min-h-screen bg-[#F7F6F3]">
      {/* ── Hero ── */}
      <section className="bg-[#1A1A2E] text-white px-6 py-20 text-center relative overflow-hidden">
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#E8FF59] text-[#1A1A2E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            🌍 Remote-first
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
            Temukan Pekerjaan
            <br />
            <span className="text-[#E8FF59]">Remote Terbaik</span> Untukmu
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Ribuan lowongan remote dari perusahaan terkemuka di seluruh dunia,
            dikurasi setiap hari.
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-white/50">
              <Briefcase size={15} />
              <span>
                <strong className="text-white">{jobs.length}</strong> lowongan
                aktif
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <TrendingUp size={15} />
              <span>
                <strong className="text-white">{featuredCount}</strong> featured
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <MapPin size={15} />
              <span>
                <strong className="text-white">{categories.length}</strong>{" "}
                kategori
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category pills ── */}
      <section className="bg-white border-b border-gray-200 px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 max-w-6xl mx-auto w-max md:w-auto">
          <button className="shrink-0 px-4 py-1.5 rounded-full bg-[#1A1A2E] text-white text-sm font-medium">
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className="shrink-0 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors bg-white"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Job listings ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
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
              Semua Lowongan
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
            <p className="text-lg font-medium">Belum ada lowongan tersedia</p>
            <p className="text-sm mt-1">Coba lagi nanti.</p>
          </div>
        )}
      </section>
    </main>
  );
}
