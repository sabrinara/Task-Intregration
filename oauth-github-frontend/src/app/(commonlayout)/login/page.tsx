"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { loginUser } from "../../../utils/actions/loginUser";

import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { data: session } = useSession();
  const route = useRouter();

  useEffect(() => {
    if (session && session.user?.login) {
      const userData = {
        username: session.user.login,
        email: session.user.email || "",
        githubRepo: "githubRepoExample",
        trelloBoard: "trelloBoardExample",
      };

      loginUser(userData)
        .then((userInfo) => {
          if (userInfo.access_token) {
            toast.success("Login successful!");
            localStorage.setItem("access_token", userInfo.access_token);
            localStorage.setItem("username", userData.username);
            localStorage.setItem("email", userData.email);
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
        });
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
    }
  }, [session]);

  const handleRepo = () => {
    route.push("/repository");
  };

  return (
    <div className="my-10">
      <h1 className="text-center text-4xl mb-5">
        Integrate with <span className="text-accent">GitHub</span> or <span className="text-accent">Slack</span>
      </h1>
      <div className="gap-4 mt-10">
        <div className="w-[30%] h-[80%] mx-auto rounded-xl">
          <div className="flex justify-center mb-10 mt-2">
            {session ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <button className="py-4 text-xl bg-red-50 px-4 rounded-xl" onClick={() => signOut()}>
                  Disconnect
                </button>

                <button className="py-4 text-xl bg-sky-50 px-4 rounded-xl" onClick={handleRepo}>
                  See All Repositories
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  className="py-4 text-xl bg-sky-50 px-4 rounded-xl"
                  onClick={() => signIn("github", { callbackUrl: "https://oauth-github-frontend.vercel.app" })}
                >
                  GitHub
                </button>
                <button
                  className="py-4 text-xl bg-green-50 px-4 rounded-xl"
                  onClick={() => signIn("slack", { callbackUrl: "https://oauth-github-frontend.vercel.app/api/auth/callback/slack" })}
                >
                  Slack
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
