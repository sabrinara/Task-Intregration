"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { loginUser } from "../utils/actions/loginUser"; 

export interface UserType {
  username: string;
  email: string;
  githubRepo: string;
  trelloBoard: string;
}

const LoginPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const userData: UserType = {
        username: session.user?.name || "",
        email: session.user?.email || "",
        githubRepo: "githubRepoExample", 
        trelloBoard: "trelloBoardExample",
      };
      console.log(userData);

      loginUser(userData).then((userInfo) => {
        if (userInfo.access_token ) {
          localStorage.setItem("access_token", userInfo.access_token);
          console.log("Token saved in localStorage:", userInfo.access_token);
        }
      }).catch((error) => {
        console.error("Login error:", error);
      });
    }
    else {
      localStorage.removeItem("access_token");
    }
  }, [session]);

  return (
    <div className="my-10">
      <h1 className="text-center text-4xl mb-5">
        Login <span className="text-accent">Here</span>
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="w-[70%] h-[80%] shadow-xl bg-base-100">
          <div className="flex justify-center mb-10 mt-2">
           { session ? (
             <>
              <button
                className="btn btn-circle"
                onClick={() => signOut()}
              >
                Logout
              </button>
             </>
           ) : (
             <>
              <button
              className="btn btn-circle"
              onClick={() =>
                signIn("github", { callbackUrl: "http://localhost:3000" })
              }
            >
              GitHub
            </button>
            </>
           )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
