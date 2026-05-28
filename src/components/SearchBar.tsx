"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { JobType } from "@prisma/client";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl mx-auto mt-8">
      <input
        type="text"
        placeholder="Job title, keyword..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 px-4 py-2.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-4 py-2.5 rounded-xl text-[#1A1A2E] text-sm outline-none bg-white"
      >
        <option value="">All Types</option>
        {Object.values(JobType).map((t) => (
          <option key={t} value={t}>
            {t.replace("_", " ")}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="bg-[#E8FF59] text-[#1A1A2E] font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Search size={16} />
        Search
      </button>
    </div>
  );
}
