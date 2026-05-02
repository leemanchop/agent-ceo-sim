/**
 * Auth.js v5 (next-auth@beta) — Google OAuth, JWT sessions.
 *
 * No database adapter. Admin status is baked into the JWT from
 * `ADMIN_EMAILS` (comma-separated env var). When OAuth env vars are
 * missing, the provider still constructs but /api/auth/signin will
 * fail loudly — that's intentional. The rest of the app degrades to
 * "no one is signed in" gracefully.
 *
 * Server components: `import { auth } from "@/lib/auth/config"`.
 * Client components: use `signIn` / `signOut` / `useSession` from
 * "next-auth/react".
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // Bake admin status into the JWT for cheap gating.
        const admins = (process.env.ADMIN_EMAILS ?? "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        token.isAdmin = admins.includes(user.email.toLowerCase());
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.name = (token.name as string) ?? session.user.name;
        session.user.image = (token.picture as string) ?? session.user.image;
        (session.user as { isAdmin?: boolean }).isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
});
