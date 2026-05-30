"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-[#FFE97D] hover:bg-[#FDD835] text-[#1A1A2E] font-bold py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
    >
      {loading ? "Upgrading..." : "Upgrade Now"}
    </button>
  );
}
