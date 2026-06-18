import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [Google],
  // -----------------------------------------------------------------------------
  // NEXTAUTH CALLBACKS (PURE JWT STRATEGY)
  // -----------------------------------------------------------------------------
  // Uses pure JSON Web Tokens to manage sessions. Google OAuth login data is
  // manually intercepted and synchronized with our PostgreSQL database.
  callbacks: {
    // 1. SIGN-IN CALLBACK
    // Triggers upon a successful Google authentication. Handles new user registration.
    async signIn({ user }) {
      if (!user.email) return false;

      await prisma.user.upsert({
        where: { email: user.email },
        update: {}, // User already exists — don't overwrite anything
        create: {
          name: user.name,
          email: user.email,
          image: user.image,
          // 'role' remains null. User is strictly forced to choose a role at /onboarding
        },
      });

      return true; // Allow sign-in execution to finish successfully
    },

    // 2. JWT CALLBACK
    // Invoked whenever a JSON Web Token is minted or updated.
    // Fetches the latest user ID and role directly from the database and injects them into the token.
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true },
        });

        // Inject custom backend payloads securely into the encrypted JWT
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    // 3. SESSION CALLBACK
    // Invoked whenever the frontend application session is read (e.g., useSession() or auth()).
    // Maps the customized internal JWT payloads into the client-facing session object.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | null;
      }
      return session;
    },
  },
});
