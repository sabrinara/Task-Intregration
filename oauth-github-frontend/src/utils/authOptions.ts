import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID as string,
      clientSecret: process.env.SLACK_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.login = token.login as string;
        session.user.provider = token.provider as string; 
      }
      return session;
    },
    

    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider; 
      }
    
      if (account?.provider === "github" && profile?.login) {
        token.login = profile.login;
      }
    
      if (account?.provider === "slack" && profile?.email) {
        token.login = profile.email;
      }
      
      return token;
    }
  },
};
