"use server";

import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// -----------------------------------------------------------------------------
// SERVER ACTION: SET USER ROLE
// -----------------------------------------------------------------------------
// Securely executes database mutations on the server side when a user selects their role.
export async function setUserRole(role: "CANDIDATE" | "EMPLOYER") {
  // 1. AUTHORIZATION CHECK
  // Ensure the request is coming from an authenticated user.
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 2. ASSIGN ROLE
  // Update the user's permanent role in the core User table.
  await prisma.user.update({
    where: { id: session.user.id },
    data: { role },
  });

  // 3. INITIALIZE EMPLOYER SUBSCRIPTION
  // Only create a billing/subscription record if the user intends to post jobs.
  // Using 'upsert' acts as a failsafe to prevent duplicate key crashes.
  if (role === "EMPLOYER") {
    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {}, // Do nothing if it accidentally exists
      create: {
        userId: session.user.id,
        plan: "FREE",
        status: "ACTIVE",
      },
    });
  }

  // 4. REFRESH SESSION TOKEN
  // Force the NextAuth JWT cookie to immediately reflect the new role
  // so the proxy/middleware instantly recognizes the updated permissions.
  await unstable_update({ user: { role } });

  // 5. SMART ROUTING
  // Redirect employers to setup their company profile, and candidates to the job board.
  redirect(role === "EMPLOYER" ? "/companies/create" : "/");
}
