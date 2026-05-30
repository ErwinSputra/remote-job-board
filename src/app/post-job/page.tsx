import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostJobForm } from "@/components/PostJobForm";

export default async function PostJobPage() {
  const session = await auth();

  if (!session) redirect("/");

  const company = await prisma.company.findFirst({
    where: { userId: session.user.id },
  });

  if (!company) redirect("/companies/create");

  return (
    <main className="bg-[#F7F6F3] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Post a Job</h1>
          <p className="text-gray-500 text-sm mt-1">
            Posting as{" "}
            <span className="font-semibold text-gray-700">{company.name}</span>
          </p>
        </div>
        <PostJobForm companyId={company.id} />
      </div>
    </main>
  );
}
