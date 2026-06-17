import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {},
      async authorize() {
        const [profile] = await db.select().from(profiles).limit(1);
        if (!profile) return null;
        return {
          id: profile.id,
          name: profile.displayName,
          image: profile.avatarUrl,
          email: "demo@sun-asterisk.com",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
