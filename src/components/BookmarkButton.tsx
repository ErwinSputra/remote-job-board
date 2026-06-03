"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

type Props = {
  jobId: string;
  isBookmarked: boolean;
};

export function BookmarkButton({ jobId, isBookmarked }: Props) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const [loading, setLoading] = useState(false);

  const toggleBookmark = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/saved-jobs", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookmarked(data.saved);

        toast.success(data.saved ? "Job saved!" : "Job removed from saved");
      } else {
        console.error("Error toggling bookmark:", data.error);

        toast.error("Failed to update bookmark.");
      }
    } catch (error) {
      console.error("Network error:", error);

      toast.error("Failed to update bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      {bookmarked ? (
        <BookmarkCheck className="w-5 h-5 text-[#1A1A2E]" />
      ) : (
        <Bookmark className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );
}
