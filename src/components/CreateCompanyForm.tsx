"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCompanyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    coverUrl: "",
    website: "",
    description: "",
    size: "",
    industry: "",
    location: "",
    linkedin: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Company name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, ""),
        }),
      });

      // Catch an error from the server response
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create company.");
        return;
      }

      router.push("/post-job");
    } catch {
      setError(
        "Failed to connect to the server. Please check your connection.",
      );
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
        <label className={labelClass}>Company Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Tech Corp Ltd."
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Logo URL</label>
          <input
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cover URL</label>
          <input
            name="coverUrl"
            value={form.coverUrl}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Website</label>
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="https://www.techcorp.com"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Company Size</label>
          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select size</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Industry</label>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="e.g. Technology"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Jakarta, Indonesia"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>LinkedIn</label>
        <input
          name="linkedin"
          value={form.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/company/..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Company Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us about your company..."
          className={inputClass}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#FFE97D] hover:bg-[#FDD835] text-[#1A1A2E] font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Company"}
      </button>
    </div>
  );
}
