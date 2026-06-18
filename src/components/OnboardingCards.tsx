"use client";

import { useState } from "react";
import { Briefcase, Search } from "lucide-react";
import { setUserRole } from "@/app/onboarding/actions"; // Adjust path if necessary

// -----------------------------------------------------------------------------
// ONBOARDING CARDS (CLIENT COMPONENT)
// -----------------------------------------------------------------------------
// Handles user interaction, loading states, and triggers the Server Action.
export default function OnboardingCards() {
  // Tracks which card is currently processing to show localized loading text
  const [loading, setLoading] = useState<"CANDIDATE" | "EMPLOYER" | null>(null);

  const handleSelect = async (role: "CANDIDATE" | "EMPLOYER") => {
    setLoading(role); // Disable buttons and show loading state
    await setUserRole(role); // Execute server-side database mutation
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      {/* ---------------- CANDIDATE CARD ---------------- */}
      <button
        onClick={() => handleSelect("CANDIDATE")}
        disabled={loading !== null}
        className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-white/10 hover:border-[#FFE97D] bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center"
      >
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: "rgba(255, 233, 125, 0.15)" }}
        >
          <Search size={32} style={{ color: "#FFE97D" }} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-1">
            {loading === "CANDIDATE" ? "Setting up..." : "I'm looking for work"}
          </h2>
          <p className="text-sm text-white/50">
            Browse and save remote jobs that match your skills
          </p>
        </div>
      </button>

      {/* ---------------- EMPLOYER CARD ---------------- */}
      <button
        onClick={() => handleSelect("EMPLOYER")}
        disabled={loading !== null}
        className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-white/10 hover:border-[#FFE97D] bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center"
      >
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: "rgba(255, 233, 125, 0.15)" }}
        >
          <Briefcase size={32} style={{ color: "#FFE97D" }} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-1">
            {loading === "EMPLOYER" ? "Setting up..." : "I'm hiring"}
          </h2>
          <p className="text-sm text-white/50">
            Post remote jobs and find the best talent worldwide
          </p>
        </div>
      </button>
    </div>
  );
}
