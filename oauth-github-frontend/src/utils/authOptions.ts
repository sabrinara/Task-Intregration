import { NextAuthOptions } from "next-auth";


import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      // Attach GitHub `login` username to the session
      if (token && session.user) {
        session.user.login = token.login as string;  // `login` comes from token
      }
      return session;
    },

    async jwt({ token, account, profile }) {
      // Attach GitHub `login` (username) to the token from profile
      if (account?.provider === "github" && profile?.login) {
        token.login = profile.login;  // GitHub `login` is stored in the token
      }
      return token;
    },
  },
};
