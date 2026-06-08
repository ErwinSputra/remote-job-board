import { auth } from "@/auth";
import OnboardingCards from "@/components/OnboardingCards";
import { BriefcaseBusiness } from "lucide-react";

export default async function OnboardingPage() {
  const session = await auth();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <BriefcaseBusiness size={28} style={{ color: "#FFE97D" }} />
        <span className="text-2xl font-bold" style={{ color: "#FFE97D" }}>
          RemoteJobs
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-white/50">How are you planning to use RemoteJobs?</p>
      </div>

      <OnboardingCards />
    </main>
  );
}
