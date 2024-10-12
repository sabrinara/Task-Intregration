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

  // Add callbacks to extend session
  callbacks: {
    async session({ session, token }) {
      // Fetch additional GitHub data and add it to the session object
      if (token && session.user) {
        session.user.login = token.login;  // Attach 'login' property to session user
      }
      return session;
    },

    async jwt({ token, account, profile }) {
      // Add the GitHub username (login) to the token object
      if (account?.provider === "github") {
        token.login = profile?.login;  // `profile.login` contains the GitHub `login` username
      }
      return token;
    },
  },
};
