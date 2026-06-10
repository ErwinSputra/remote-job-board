import Link from "next/link";
import { auth } from "../auth";
import { prisma } from "@/lib/prisma";
import AuthButton from "./AuthButton";
import MobileMenu from "./MobileMenu";
import { BriefcaseBusiness } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  highlight?: boolean;
};

function buildNavLinks(role?: string, isPremium?: boolean): NavLink[] {
  if (!role) return [];
  if (role === "CANDIDATE") {
    return [{ href: "/saved", label: "Saved Jobs" }];
  }
  if (role === "EMPLOYER" || role === "ADMIN") {
    const links: NavLink[] = [
      { href: "/dashboard", label: "My Dashboard" },
      { href: "/post-job", label: "Post a Job", highlight: true },
    ];
    if (!isPremium) {
      links.push({ href: "/upgrade", label: "⚡ Upgrade" });
    }
    return links;
  }
  return [];
}

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  let isPremium = false;
  if (user?.id && (user.role === "EMPLOYER" || user.role === "ADMIN")) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: { plan: true },
    });
    isPremium = subscription?.plan === "PREMIUM_POSTER";
  }

  const navLinks = buildNavLinks(user?.role ?? undefined, isPremium);

  return (
    <header className="sticky top-0 z-50 bg-[#1A1A2E] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BriefcaseBusiness size={22} className="text-[#FFE97D]" />
            <span className="text-lg font-bold tracking-tight text-[#FFE97D]">
              RemoteJobs
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  link.highlight
                    ? "bg-[#FFE97D] text-[#1A1A2E] font-semibold hover:bg-[#FDD835]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-2 pl-2 border-l border-white/20">
              <AuthButton user={user} />
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <AuthButton user={user} />
            <MobileMenu links={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}
