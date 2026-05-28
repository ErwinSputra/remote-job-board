import Link from "next/link";
import { auth } from "@/auth";
import { AuthButton } from "@/components/AuthButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-[#1A1A2E] border-b border-white/10">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-[#E8FF59] text-[#1A1A2E] text-xs font-black px-2 py-0.5 rounded">
            RJB
          </span>
          <span className="text-white font-bold text-lg tracking-tight">
            Remote Job Board
          </span>
        </Link>

        <ul className="flex items-center gap-1">
          <li>
            <Link
              href="/"
              className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/jobs"
              className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Jobs
            </Link>
          </li>
          <li className="ml-3">
            <AuthButton user={session?.user} />
          </li>
        </ul>
      </div>
    </nav>
  );
}
