"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { loginUser } from "../../../utils/actions/loginUser";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    if (session && session.user?.login) {
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
  }, [session]);

  const handleRepo = () => {
    router.push("/repository");
  };

  return (
    <div className="my-10">
      <h1 className="text-center text-4xl mb-5">
        Integrate with <span className="text-accent">GitHub</span>, <span className="text-accent">Slack</span>, or <span className="text-accent">Jira</span>
      </h1>
      <div className="gap-4 mt-10">
        <div className="w-[30%] h-[80%] mx-auto rounded-xl">
          <div className="flex justify-center mb-10 mt-2">
            {session ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <button className="py-4 text-xl bg-red-50 px-4 rounded-xl" onClick={() => signOut()}>
                  Disconnect
                </button>

                {session.user?.provider === "github" && (
                  <button className="py-4 text-xl bg-sky-50 px-4 rounded-xl" onClick={handleRepo}>
                    See All Repositories
                  </button>
                )}
                {session.user?.provider === "slack" && (
                  <button className="py-4 text-xl bg-green-50 px-4 rounded-xl" onClick={handleRepo}>
                    See All Boards
                  </button>
                )}
                {session.user?.provider === "atlassian" && (
                  <button className="py-4 text-xl bg-orange-50 px-4 rounded-xl" onClick={handleRepo}>
                    See All Jira Boards
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  className="py-4 text-xl bg-sky-50 px-4 rounded-xl"
                  onClick={() => signIn("github", { callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL })}
                >
                  GitHub
                </button>
                <button
                  className="py-4 text-xl bg-green-50 px-4 rounded-xl"
                  onClick={() => signIn("slack", { callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL })}
                >
                  Slack
                </button>
                <button
                  className="py-4 text-xl bg-orange-50 px-4 rounded-xl"
                  onClick={() => signIn("atlassian", { callbackUrl:`http://localhost:3000/api/auth/callback/atlassian` })}
                >
                  Jira
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
