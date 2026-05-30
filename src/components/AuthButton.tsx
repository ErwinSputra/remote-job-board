"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user?: {
    name?: string | null;
    image?: string | null;
  };
};

export function AuthButton({ user }: Props) {
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
        <Link
          href="/upgrade"
          className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          Upgrade
        </Link>
        <span className="text-white/70 text-sm hidden md:block">
          {user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="cursor-pointer text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
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
