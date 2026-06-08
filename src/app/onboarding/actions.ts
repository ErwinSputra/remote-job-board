"use server";

import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function setUserRole(role: "CANDIDATE" | "EMPLOYER") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role },
  });

  // Force JWT cookie to update with new role before redirect
  await unstable_update({ user: { role } });

  redirect(role === "EMPLOYER" ? "/companies/create" : "/");
}
