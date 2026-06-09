"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Pencil,
  Trash2,
  Plus,
  Crown,
  Briefcase,
  Building2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { deleteJob, updateCompany } from "@/app/dashboard/actions";

type Job = {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  isFeatured: boolean;
  createdAt: Date;
};

type Company = {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  location: string | null;
  industry: string | null;
  size: string | null;
  linkedin: string | null;
  twitter: string | null;
};

type Props = {
  company: Company;
  jobs: Job[];
  isPremium: boolean;
};

export default function DashboardClient({ company, jobs, isPremium }: Props) {
  const [activeTab, setActiveTab] = useState<"jobs" | "company">("jobs");

  return (
    <main className="min-h-screen bg-[#F7F6F3]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Managing as{" "}
              <span className="font-semibold text-gray-700">
                {company.name}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isPremium && (
              <Link
                href="/upgrade"
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 transition-colors"
              >
                <Crown size={14} />
                Upgrade
              </Link>
            )}
            <Link
              href="/post-job"
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#1A1A2E" }}
            >
              <Plus size={14} />
              Post a Job
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {(["jobs", "company"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-[#1A1A2E] text-[#1A1A2E]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "jobs" ? (
                <Briefcase size={14} />
              ) : (
                <Building2 size={14} />
              )}
              {tab === "jobs" ? "My Jobs" : "Company"}
              {tab === "jobs" && (
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {jobs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "jobs" ? (
          <JobsTab jobs={jobs} isPremium={isPremium} />
        ) : (
          <CompanyTab company={company} />
        )}
      </div>
    </main>
  );
}

// ─── Jobs Tab ────────────────────────────────────────────────────────────────

function JobsTab({ jobs, isPremium }: { jobs: Job[]; isPremium: boolean }) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
        <Briefcase size={40} className="text-gray-200 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          No jobs posted yet
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Post your first job to start finding candidates.
        </p>
        <Link
          href="/post-job"
          className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          Post a Job
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {!isPremium && (
        <div className="flex items-center justify-between px-6 py-3 bg-yellow-50 border-b border-yellow-100">
          <p className="text-sm text-yellow-700">
            Free plan:{" "}
            <span className="font-semibold">{jobs.length}/3 jobs</span> used
          </p>
          <Link
            href="/upgrade"
            className="text-sm font-semibold text-yellow-700 hover:underline"
          >
            Upgrade →
          </Link>
        </div>
      )}
      <div className="divide-y divide-gray-50">
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function JobRow({ job }: { job: Job }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteJob(job.id);
        toast.success("Job deleted successfully");
      } catch {
        toast.error("Failed to delete job");
      }
      setConfirmDelete(false);
    });
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 truncate">
            {job.title}
          </span>
          {job.isFeatured && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{job.type.replace("_", " ")}</span>
          <span>·</span>
          <span>
            Posted{" "}
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </span>
          <span>·</span>
          <span
            className={`font-medium ${job.status === "ACTIVE" ? "text-green-600" : "text-gray-400"}`}
          >
            {job.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4 shrink-0">
        <Link
          href={`/jobs/${job.slug}`}
          target="_blank"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="View job"
        >
          <ExternalLink size={14} />
        </Link>
        <Link
          href={`/dashboard/jobs/${job.id}/edit`}
          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit job"
        >
          <Pencil size={14} />
        </Link>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Deleting..." : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete job"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Company Tab ─────────────────────────────────────────────────────────────

function CompanyTab({ company }: { company: Company }) {
  const [form, setForm] = useState({
    name: company.name ?? "",
    description: company.description ?? "",
    website: company.website ?? "",
    location: company.location ?? "",
    industry: company.industry ?? "",
    size: company.size ?? "",
    linkedin: company.linkedin ?? "",
    twitter: company.twitter ?? "",
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await updateCompany(company.id, form);
        toast.success("Company updated successfully");
      } catch {
        toast.error("Failed to update company");
      }
    });
  };

  const field = (
    label: string,
    key: keyof typeof form,
    placeholder?: string,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A2E] transition"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Company Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field("Company Name", "name", "Acme Inc.")}
        {field("Website", "website", "https://acme.com")}
        {field("Location", "location", "San Francisco, CA")}
        {field("Industry", "industry", "Software Engineering")}
        {field("Company Size", "size", "1-10, 11-50, 51-200...")}
        {field("LinkedIn", "linkedin", "https://linkedin.com/company/acme")}
        {field("Twitter", "twitter", "https://twitter.com/acme")}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={4}
          placeholder="Tell candidates about your company..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A2E] transition resize-none"
        />
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="text-sm font-semibold px-6 py-2.5 rounded-lg text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
