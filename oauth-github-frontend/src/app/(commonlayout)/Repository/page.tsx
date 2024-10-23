"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";
import { repositories } from "@/utils/actions/repositories";
interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  forks_count: number;
  stargazers_count: number;
  open_issues_count: number;
  license: {
    name: string;
  };
}
const Repository = () => {
  
  const router = useRouter(); 
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
   
      fetchRepositories(storedUsername);
    }
  }, []);

  const fetchRepositories = async (username: string) => {
    const repoData = await repositories(username);
    setRepos(repoData);
  };

  const handleIssues = (repoName: string) => {
    const repositoryName = localStorage.setItem("repo", repoName);
    console.log(repositoryName);
    toast.success( `Created issues for ${repoName}`);

    router.push('/issues');
  };

  return (
    <div className="w-[90%] mx-auto my-10">
      <h2 className="text-4xl text-center">Repositories of user {username}</h2>
      <div className="grid grid-cols-4 gap-5 mt-10">
        {repos.map((repo) => (
          <div key={repo.id}>
            <div className="flex flex-col justify-center items-center gap-2 bg-sky-50 p-4 rounded-md">
              <h1>{repo.name}</h1>
              <button className="bg-sky-200 px-2 py-1 rounded-md" onClick={() => handleIssues(repo.name)}>
                Create Issues
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Repository;
