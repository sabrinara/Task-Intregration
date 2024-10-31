// page.tsx

"use client";
import { FaGithub } from "react-icons/fa";
import { FaSlack } from "react-icons/fa6";
import { SiJira } from "react-icons/si";
import { signIn, signOut, useSession } from "next-auth/react";
import { loginUser } from "../../../utils/actions/loginUser";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const [jiraInstanceUrl, setJiraInstanceUrl] = useState<string | null>(null);

  // Fetch Jira instance URL if authenticated with Atlassian
  useEffect(() => {
    if (session?.user?.provider === "atlassian" && session.user.accessToken) {
      const fetchJiraInstanceUrl = async () => {
        try {
          const response = await axios.get("https://api.atlassian.com/oauth/token/accessible-resources", {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          });

          if (response.data && response.data.length > 0) {

            const instanceUrl = response.data[0].url; 
            setJiraInstanceUrl(instanceUrl);
            
            localStorage.setItem("jiraInstanceURL", instanceUrl);
            localStorage.setItem("provider", session.user.provider as string);
            localStorage.setItem("accessToken", session.user.accessToken as string);
            localStorage.setItem("email", session.user.email as string);

            if(session.user.provider === "atlassian"){
              toast.success("Login with Jira successfully!");
            }
            console.log("Jira instance URL:", jiraInstanceUrl);
            
          }
        } catch (error) {
          console.error("Error fetching Jira instance URL:", error);
        }
      };

      fetchJiraInstanceUrl();
    }
  }, [session]);

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
         
            localStorage.setItem("access_token", userInfo.access_token);
            localStorage.setItem("username", userData.username as string);
            localStorage.setItem("email", userData.email);
            localStorage.setItem("provider", session.user.provider as string);
            if(session.user.provider === "github"){
              toast.success("Login with GitHub successfully!");
            }else if(session.user.provider === "slack"){
              toast.success("Login with Slack successfully!");
            }
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
          toast.error("Login failed. Please try again.");
        });
    } 
  }, [session]);

  const handleRepo = () => {
    router.push("/Repository");
  };

  // const handleSlack = () => {
  //   router.push("/slackcard");
  // };

  const handleJira = () => {
    // const access_token = localStorage.getItem("access_token");
    // if (!access_token) {
    //   toast.error("Access token is missing.");
    //   return;
    // }
    router.push("/jiraproject");
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });  
    toast.success("Logout successful!");
      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("provider");
      localStorage.removeItem("jiraInstanceURL");

    
  }
  return (
    <div className="my-10">
      <h1 className="text-center text-4xl mb-5">
        Integrate with <span className="text-accent">GitHub</span>, <span className="text-accent text-red-700">Slack</span>, or <span className="text-accent text-blue-700">Jira</span>
      </h1>
      <div className="gap-4 mt-10">
        <div className="w-[30%] h-[80%] mx-auto rounded-xl">
          <div className="flex justify-center mb-10 mt-2">
            {session ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <button className="py-4 text-xl bg-red-50 px-4 rounded-xl" onClick={handleLogout}>
                  Disconnect
                </button>

                {session.user?.provider === "github" && (
                  <button className="py-4 text-xl bg-sky-50 px-4 rounded-xl" onClick={handleRepo}>
                    See All Repositories
                  </button>
                )}
                {session.user?.provider === "slack" && (
                  <button className="py-4 text-xl bg-green-50 px-4 rounded-xl" >
                    <a href="https://app.slack.com/">Go to Slack for best experience</a>
                  </button>
                )}
                {session.user?.provider === "atlassian" && (
                  <button className="py-4 text-xl bg-orange-50 px-4 rounded-xl" onClick={handleJira}>
                    Go to Jira Dashboard
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
                  <FaSlack className="text-red-700" /> Login with Slack
                </button>
                <button
                  className="flex items-center gap-2 py-4 text-2xl bg-blue-50 px-4 rounded-xl text-blue-700"
                  onClick={() => signIn("atlassian", { callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL + `/api/auth/callback/atlassian` })}
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
