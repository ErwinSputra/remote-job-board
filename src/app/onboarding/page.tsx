import { auth } from "@/auth";
import OnboardingCards from "@/components/OnboardingCards";
import { BriefcaseBusiness } from "lucide-react";
import type { Metadata } from "next";

// -----------------------------------------------------------------------------
// SEO & METADATA
// -----------------------------------------------------------------------------
// Tells search engines NOT to index this page since it's an internal application step.
export const metadata: Metadata = {
  title: "Get Started",
  description: "Tell us how you plan to use RemoteJobs.",
  robots: { index: false, follow: false },
};

// -----------------------------------------------------------------------------
// ONBOARDING PAGE (SERVER COMPONENT)
// -----------------------------------------------------------------------------
// Renders the initial layout and extracts the user's name from the server session
// to provide a personalized greeting. Passes interactivity down to the Client Component.
export default async function OnboardingPage() {
  const session = await auth();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-2 mb-10">
        <BriefcaseBusiness size={28} style={{ color: "#FFE97D" }} />
        <span className="text-2xl font-bold" style={{ color: "#FFE97D" }}>
          RemoteJobs
        </span>
      </div>

      {/* Personalized Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          {/* Grabs only the first name for a friendlier greeting */}
          Welcome, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-white/50">How are you planning to use RemoteJobs?</p>
      </div>

      {/* Interactive Role Selection Cards */}
      <OnboardingCards />
    </main>
  );
}
