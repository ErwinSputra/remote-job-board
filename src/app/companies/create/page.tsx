import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateCompanyForm } from "@/components/CreateCompanyForm";

export default async function CreateCompanyPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <main className="bg-[#F7F6F3] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Create Company</h1>
          <p className="text-gray-500 text-sm mt-1">
            Set up your company profile before posting jobs.
          </p>
        </div>
        <CreateCompanyForm />
      </div>
    </main>
  );
}
