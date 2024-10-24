"use client";
import { FaGithub } from "react-icons/fa";
import { FaSlack } from "react-icons/fa6";
import { SiJira } from "react-icons/si";
import { signIn, signOut, useSession } from "next-auth/react";
import { loginUser } from "../../../utils/actions/loginUser";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJiraInstance } from "@/utils/actions/getJiraInstance";

export interface UserType {
  username: string;
  email: string;
  image: string;
  githubRepo: string;
  trelloBoard: string;
}

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Access localStorage only on the client-side
      const token = localStorage.getItem("access_token");
      setAccessToken(token);
    }

    if (session && session.user?.login && accessToken) {
      const userData = {
        username: session.user.login || session.user.name,
        email: session.user.email || "",
        image: session.user.image_original || session.user.avatar_url || "",
        githubRepo: "githubRepoExample",
        trelloBoard: "trelloBoardExample",
      };

      loginUser(userData as UserType)
        .then((userInfo) => {
          if (userInfo.access_token) {
            toast.success("Login successful!");
            localStorage.setItem("access_token", userInfo.access_token);
            localStorage.setItem("username", userData.username as string);
            localStorage.setItem("email", userData.email);
            localStorage.setItem("provider", session.user.provider as string);

            if (session.user.provider === "atlassian") {
              getJiraInstance(userInfo.access_token)
                .then((jiraInstance) => {
                  localStorage.setItem("jiraInstance", jiraInstance);
                  // router.push("/Repository");
                })
                .catch((error) => {
                  console.error("Error getting Jira instance:", error);
                  toast.error("Error getting Jira instance. Please try again.");
                });
            }
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
          toast.error("Login failed. Please try again.");
        });
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("provider");
    }
  }, [session, accessToken]);

  const handleRepo = () => {
    router.push("/Repository");
  };
  const handleSlack = () => {
    router.push("/slackcard");
  };

  return (
    <div className="my-10">
      <h1 className="text-center text-4xl mb-5">
        Integrate with <span className="text-accent">GitHub</span>,{" "}
        <span className="text-accent text-red-700">Slack</span>, or{" "}
        <span className="text-accent text-blue-700">Jira</span>
      </h1>
      <div className="gap-4 mt-10">
        <div className="w-[30%] h-[80%] mx-auto rounded-xl">
          <div className="flex justify-center mb-10 mt-2">
            {session ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <button
                  className="py-4 text-xl bg-red-50 px-4 rounded-xl"
                  onClick={() => signOut()}
                >
                  Disconnect
                </button>

                {session.user?.provider === "github" && (
                  <button
                    className="py-4 text-xl bg-sky-50 px-4 rounded-xl"
                    onClick={handleRepo}
                  >
                    See All Repositories
                  </button>
                )}
                {session.user?.provider === "slack" && (
                  <button
                    className="py-4 text-xl bg-green-50 px-4 rounded-xl"
                    onClick={handleSlack}
                  >
                    Create a card
                  </button>
                )}
                {session.user?.provider === "atlassian" && (
                  <button
                    className="py-4 text-xl bg-orange-50 px-4 rounded-xl"
                    onClick={handleRepo}
                  >
                    See All Jira Boards
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  className="flex items-center gap-2 py-4 text-2xl bg-sky-50 px-4 rounded-xl"
                  onClick={() => signIn("github", { callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL })}
                >
                  <FaGithub /> Login with GitHub
                </button>
                <button
                  className="flex items-center gap-2 py-4 text-2xl bg-green-50 text-red-700 px-4 rounded-xl"
                  onClick={() => signIn("slack", { callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL })}
                >
                  <FaSlack className="text-red-700" />Login with Slack
                </button>
                <button
                  className="flex items-center gap-2 py-4 text-2xl bg-blue-50 px-4 rounded-xl text-blue-700"
                  onClick={() =>
                    signIn("atlassian", { callbackUrl: `https://oauth-github-frontend.vercel.app/api/auth/callback/atlassian` })
                  }
                >
                  <SiJira className="text-blue-700" /> Login with Jira
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
