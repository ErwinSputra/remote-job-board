"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CreateCompanyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NEW: separate loading/preview state for the logo upload itself,
  // distinct from the overall form submission `loading` state.
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
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

  // NEW: handles file selection, shows an instant local preview, then
  // uploads the file to our API route and stores the returned public URL.
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // NEW: client-side validation BEFORE upload starts. This is a UX nicety,
    // not a security boundary — the server route still re-validates everything,
    // since a user could bypass this check entirely (devtools, direct API call).
    // Keeping these limits in sync with the server route's constants is a manual
    // step for now — fine for MVP scope, but worth a shared constants file later.
    const ALLOWED_TYPES = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
    ];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Allowed: PNG, JPEG, WEBP, SVG.");
      e.target.value = ""; // reset the input so the same bad file can be re-picked
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Max size is 2MB.");
      e.target.value = "";
      return;
    }

    // Show an instant preview using the local file (before upload finishes).
    const localPreviewUrl = URL.createObjectURL(file);
    setLogoPreview(localPreviewUrl);

    setUploadingLogo(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to upload logo.");
        setLogoPreview(null);
        return;
      }

      setForm((prev) => ({ ...prev, logoUrl: data.url }));
      setLogoPreview(data.url);
    } catch {
      setError("Failed to upload logo. Please check your connection.");
      setLogoPreview(null);
    } finally {
      setUploadingLogo(false);
    }
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

      {/* CHANGED: Logo field is now a file picker with preview, not a text input.
          Cover URL stays a text input for now, per your earlier decision. */}
      <div>
        <label className={labelClass}>Company Logo</label>
        <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50">
          <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={64}
                height={64}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">No logo</span>
            )}
          </div>
          <div className="text-center">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A1A2E] file:text-white file:text-sm file:font-medium hover:file:opacity-90 cursor-pointer disabled:opacity-50"
            />
            {uploadingLogo && (
              <p className="text-xs text-gray-400 mt-1">Uploading...</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPEG, WEBP or SVG · Max 2MB
            </p>
          </div>
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
        disabled={loading || uploadingLogo}
        className="w-full bg-[#FFE97D] hover:bg-[#FDD835] text-[#1A1A2E] font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Company"}
      </button>
    </div>
  );
}
