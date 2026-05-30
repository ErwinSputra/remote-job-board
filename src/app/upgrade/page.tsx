import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UpgradeButton } from "@/components/UpgradeButton";

export default async function UpgradePage() {
  const session = await auth();
  if (!session) redirect("/");

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isPremium = subscription?.plan === "PREMIUM_POSTER";

  return (
    <main className="bg-[#F7F6F3] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 mb-3">
            Choose Your Plan
          </h1>
          <p className="text-gray-500">
            Post jobs and find the best remote talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div
            className={`bg-white rounded-2xl border p-8 ${!isPremium ? "border-gray-900 ring-2 ring-gray-900" : "border-gray-200"}`}
          >
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
                Free
              </p>
              <p className="text-4xl font-black text-gray-900">$0</p>
              <p className="text-gray-400 text-sm mt-1">Forever free</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              <li className="flex items-center gap-2">✅ Post up to 3 jobs</li>
              <li className="flex items-center gap-2">
                ✅ Basic company profile
              </li>
              <li className="flex items-center gap-2">❌ Featured placement</li>
              <li className="flex items-center gap-2">❌ Unlimited jobs</li>
              <li className="flex items-center gap-2">❌ Priority support</li>
            </ul>
            {!isPremium && (
              <div className="w-full text-center py-2.5 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold">
                Current Plan
              </div>
            )}
          </div>

          {/* Premium Plan */}
          <div
            className={`bg-[#1A1A2E] rounded-2xl border p-8 ${isPremium ? "border-[#FFE97D] ring-2 ring-[#FFE97D]" : "border-transparent"}`}
          >
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-[#FFE97D] mb-2">
                Premium
              </p>
              <p className="text-4xl font-black text-white">$29</p>
              <p className="text-white/40 text-sm mt-1">per month</p>
            </div>
            <ul className="space-y-3 text-sm text-white/70 mb-8">
              <li className="flex items-center gap-2">✅ Unlimited jobs</li>
              <li className="flex items-center gap-2">✅ Featured placement</li>
              <li className="flex items-center gap-2">
                ✅ Company logo highlighted
              </li>
              <li className="flex items-center gap-2">✅ Jobs last 60 days</li>
              <li className="flex items-center gap-2">✅ Priority support</li>
            </ul>
            {isPremium ? (
              <div className="w-full text-center py-2.5 rounded-xl bg-[#FFE97D] text-[#1A1A2E] text-sm font-bold">
                Current Plan
              </div>
            ) : (
              <UpgradeButton />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
