"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobType, ExperienceLevel } from "@prisma/client";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  companyId: string;
};

export function PostJobForm({ companyId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    type: JobType.FULL_TIME,
    category: "",
    tags: "",
    experienceLevel: ExperienceLevel.MID,
    region: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    salaryPublic: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      form.salaryMin &&
      form.salaryMax &&
      parseInt(form.salaryMin) > parseInt(form.salaryMax)
    ) {
      toast.error("Minimum salary cannot be greater than maximum");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          companyId,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      const data = await res.json();
      router.push(`/jobs/${data.slug}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Job Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Senior Frontend Engineer"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Job Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          >
            {Object.values(JobType).map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Experience Level *</label>
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            className={inputClass}
          >
            {Object.values(ExperienceLevel).map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Region</label>
          <input
            name="region"
            value={form.region}
            onChange={handleChange}
            placeholder="e.g. Worldwide, US Only"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Min Salary</label>
          <input
            name="salaryMin"
            type="number"
            value={form.salaryMin}
            onChange={handleChange}
            placeholder="5000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Max Salary</label>
          <input
            name="salaryMax"
            type="number"
            value={form.salaryMax}
            onChange={handleChange}
            placeholder="10000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="USD">USD</option>
            <option value="IDR">IDR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="salaryPublic"
          id="salaryPublic"
          checked={form.salaryPublic}
          onChange={handleChange}
          className="w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor="salaryPublic"
          className="text-sm text-gray-600 cursor-pointer"
        >
          Show salary publicly
        </label>
      </div>

      <div>
        <label className={labelClass}>Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js (comma separated)"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Job Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe the role..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Requirements</label>
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          rows={4}
          placeholder="List the qualifications..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Benefits</label>
        <textarea
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          rows={3}
          placeholder="What do you offer?"
          className={inputClass}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#FFE97D] hover:bg-[#FDD835] text-[#1A1A2E] font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Job"}
      </button>
    </div>
  );
}
