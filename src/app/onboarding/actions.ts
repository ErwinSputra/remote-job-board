"use server";

import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function setUserRole(role: "CANDIDATE" | "EMPLOYER") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 1. Update role user di tabel User
  await prisma.user.update({
    where: { id: session.user.id },
    data: { role },
  });

  // 2. Buatkan data Subscription jika dia EMPLOYER
  if (role === "EMPLOYER") {
    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {}, // Jika datanya tanpa sengaja sudah ada, diamkan saja
      create: {
        userId: session.user.id,
        plan: "FREE",
        status: "ACTIVE",
      },
    });
  }

  // Force JWT cookie to update with new role before redirect
  await unstable_update({ user: { role } });

  redirect(role === "EMPLOYER" ? "/companies/create" : "/");
}
