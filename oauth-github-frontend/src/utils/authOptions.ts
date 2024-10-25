// authOptions.ts

import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import AtlassianProvider from "next-auth/providers/atlassian";
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
    AtlassianProvider({
      clientId: process.env.ATLASSIAN_CLIENT_ID as string,
      clientSecret: process.env.ATLASSIAN_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "write:jira-work read:jira-work read:jira-user offline_access read:me"
        }
      }
    })
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
        session.user.jira_instance_url = token.jira_instance_url as string; // Add instance URL to session
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

      if (account?.provider === "atlassian") {
        token.login = profile?.email || "";
        // Log Atlassian profile data to inspect for instance URL
        console.log("Atlassian Profile Data:", profile);

        // Assuming the instance URL is part of the profile
        if (profile?.instance_url) { // Adjust if necessary
          token.jira_instance_url = profile.instance_url;
        }
      }
      
      return token;
    }
  },
};
