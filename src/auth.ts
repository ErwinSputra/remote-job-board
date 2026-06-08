import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existing) {
        const newUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        });

        await prisma.subscription.create({
          data: { userId: newUser.id },
        });
      }

      return true;
    },

    // auth.ts — update the jwt callback
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    // 👇 Expose it on the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | null;
      }
      return session;
    },
  },
});
