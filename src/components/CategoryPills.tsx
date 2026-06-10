"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  categories: string[];
};

export function CategoryPills({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";

  const handleClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2 max-w-6xl mx-auto w-max md:w-auto">
      <button
        onClick={() => handleClick("")}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors
          ${
            active === ""
              ? "bg-[#1A1A2E] text-white shadow-md shadow-gray-400/40"
              : "border border-gray-200 text-gray-600 hover:border-gray-400 bg-white shadow-sm hover:shadow-md shadow-gray-300/50"
          }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors
            ${
              active === cat
                ? "bg-[#1A1A2E] text-white shadow-md shadow-gray-400/40"
                : "border border-gray-200 text-gray-600 hover:border-gray-400 bg-white shadow-sm hover:shadow-md shadow-gray-300/50"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
