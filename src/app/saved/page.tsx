import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SavedJobsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-500 mt-1">
          {savedJobs.length === 0
            ? "You haven't saved any jobs yet"
            : `${savedJobs.length} job${savedJobs.length > 1 ? "s" : ""} saved`}
        </p>
      </div>

      {/* Empty state stays the same */}
      {savedJobs.length === 0 ? (
        // ... keep existing empty state, just fix text colors:
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Bookmark size={48} className="text-gray-200 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No saved jobs yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Browse jobs and click the bookmark icon to save them here.
          </p>
          <Link
            href="/"
            className="text-sm font-semibold px-5 py-2.5 rounded-lg text-[#1A1A2E] transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FFE97D" }}
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map(({ job }) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      )}
    </main>
  );
}
