"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-[#F7F6F3] flex-1 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-8xl font-black text-[#1A1A2E] mb-4">500</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Terjadi kesalahan
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Sesuatu yang tidak terduga terjadi. Coba lagi atau kembali ke beranda.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-[#1A1A2E] text-white font-bold px-6 py-2.5 rounded-xl transition-colors hover:bg-[#2a2a3e] cursor-pointer"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="bg-[#FFE97D] hover:bg-[#FDD835] text-[#1A1A2E] font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
