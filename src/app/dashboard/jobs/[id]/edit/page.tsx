import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditJobForm from "@/components/EditJobForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) redirect("/");

  const job = await prisma.job.findFirst({
    where: { id: params.id, company: { userId: session.user.id } },
  });

  if (!job) redirect("/dashboard");

  return (
    <main className="bg-[#F7F6F3] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Edit Job</h1>
          <p className="text-gray-500 text-sm mt-1">{job.title}</p>
        </div>
        <EditJobForm job={job} />
      </div>
    </main>
  );
}
