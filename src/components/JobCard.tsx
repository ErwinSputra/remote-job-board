import { Job, Company } from "@prisma/client";
import Image from "next/image";
import { formatSalary } from "@/lib/utils";

type JobWithCompany = Job & {
  company: Company;
};

export function JobCard({
  title,
  type,
  category,
  region,
  salaryMin,
  salaryMax,
  currency,
  isFeatured,
  createdAt,
  company,
}: JobWithCompany) {
  const salary = formatSalary(salaryMin, salaryMax, currency);

  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const postedLabel =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  const typeColors: Record<string, string> = {
    FULL_TIME: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PART_TIME: "bg-blue-50 text-blue-700 border-blue-200",
    CONTRACT: "bg-amber-50 text-amber-700 border-amber-200",
    FREELANCE: "bg-purple-50 text-purple-700 border-purple-200",
    INTERNSHIP: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const typeLabel: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship",
  };

  return (
    <div
      className={`relative group bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden
      ${isFeatured ? "border-amber-300 shadow-amber-100 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
    >
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-amber-400 text-[#1A1A2E] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
          ⭐ Featured
        </div>
      )}

      <div className="p-5">
        {/* Company row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {company.logoUrl ? ( // ✅ fixed: was company.logo
              <Image
                src={company.logoUrl}
                alt={company.name}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {company.name[0]}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {company.name}
            </p>
            {company.website && (
              <p className="text-xs text-gray-400 truncate">
                {company.website.replace(/^https?:\/\//, "")}
              </p>
            )}
          </div>
        </div>

        {/* Job title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${typeColors[type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
          >
            {typeLabel[type] ?? type}
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
            {category}
          </span>
          {region && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border bg-sky-50 text-sky-700 border-sky-200">
              🌍 {region}
            </span>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">
            {salary ?? (
              <span className="text-gray-400 font-normal text-xs">
                Salary not listed
              </span>
            )}
          </span>
          <span className="text-xs text-gray-400">{postedLabel}</span>
        </div>
      </div>
    </div>
  );
}
