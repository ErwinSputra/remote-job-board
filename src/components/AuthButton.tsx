"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

type Props = {
  user?: {
    name?: string | null;
    image?: string | null;
  };
};

export default function AuthButton({ user }: Props) {
  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        {/* Signed in */}
        <span className="text-sm hidden md:block text-gray-500 dark:text-white/70">
          {user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="cursor-pointer text-sm px-3 py-1.5 rounded-lg transition-colors text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="cursor-pointer bg-[#FFE97D] text-[#1A1A2E] text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-[#FDD835] transition-colors"
    >
      Sign In
    </button>
  );
}
