"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
// 1. Import ChevronDown dari lucide-react
import { Search, ChevronDown } from "lucide-react";
import { ExperienceLevel, JobType } from "@prisma/client";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [experienceLevel, setExperienceLevel] = useState(
    searchParams.get("experienceLevel") ?? "",
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (experienceLevel) params.set("experienceLevel", experienceLevel);
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const inputClass =
    "px-4 py-2.5 rounded-xl text-sm outline-none transition-colors " +
    "bg-white/10 text-white placeholder:text-white/40 " +
    "border border-white/10 focus:border-white/30";

  // 2. Class tambahan khusus untuk select
  // appearance-none: Menghilangkan panah bawaan browser
  // pr-10: Memberikan ruang kosong di kanan agar teks tidak menabrak ikon baru kita
  const selectClass = `${inputClass} appearance-none pr-10 cursor-pointer w-full`;

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl mx-auto mt-8">
      <input
        type="text"
        placeholder="Job title, keyword..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className={`flex-1 ${inputClass}`}
      />

      {/* 3. Wrapper Relative untuk Job Type */}
      <div className="relative">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClass}
        >
          <option value="" className="bg-[#1A1A2E]">
            All Types
          </option>
          {Object.values(JobType).map((t) => (
            <option key={t} value={t} className="bg-[#1A1A2E]">
              {t.replace("_", " ")}
            </option>
          ))}
        </select>
        {/* Ikon Lucide diletakkan secara absolut. 
            Ubah right-4 menjadi right-5 atau lebih jika ingin makin ke kiri */}
        <ChevronDown
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
        />
      </div>

      {/* Wrapper Relative untuk Experience Level */}
      <div className="relative">
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className={selectClass}
        >
          <option value="" className="bg-[#1A1A2E]">
            All Experience Levels
          </option>
          {Object.values(ExperienceLevel).map((level) => (
            <option key={level} value={level} className="bg-[#1A1A2E]">
              {level.replace("_", " ")}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-[#FFE97D] text-[#1A1A2E] font-bold px-6 py-2.5 rounded-xl hover:bg-[#FDD835] transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Search size={16} />
        Search
      </button>
    </div>
  );
}
