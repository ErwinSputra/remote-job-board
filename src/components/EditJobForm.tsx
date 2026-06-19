"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobType, ExperienceLevel, JobStatus } from "@prisma/client";
import { toast } from "sonner";
import { updateJob } from "@/app/dashboard/actions";
import { CATEGORIES } from "@/lib/categories";

type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  type: string;
  category: string;
  tags: string[];
  experienceLevel: string;
  region: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  salaryPublic: boolean;
  status: string;
};

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: job.title,
    description: job.description,
    requirements: job.requirements ?? "",
    benefits: job.benefits ?? "",
    type: job.type,
    category: job.category,
    tags: job.tags.join(", "),
    experienceLevel: job.experienceLevel,
    region: job.region ?? "",
    salaryMin: job.salaryMin?.toString() ?? "",
    salaryMax: job.salaryMax?.toString() ?? "",
    currency: job.currency,
    salaryPublic: job.salaryPublic,
    status: job.status,
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
    if (
      form.salaryMin &&
      form.salaryMax &&
      parseInt(form.salaryMin) > parseInt(form.salaryMax)
    ) {
      toast.error("Minimum salary cannot be greater than maximum");
      return;
    }

    setLoading(true);
    try {
      await updateJob(job.id, {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
      });
      toast.success("Job updated successfully!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Job Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Status — only shown in edit */}
      <div>
        <label className={labelClass}>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={inputClass}
        >
          <option value={JobStatus.ACTIVE}>Active</option>
          <option value={JobStatus.CLOSED}>Closed</option>
        </select>
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
          className={inputClass}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-[#FFE97D] hover:bg-[#FDD835] text-[#1A1A2E] font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
