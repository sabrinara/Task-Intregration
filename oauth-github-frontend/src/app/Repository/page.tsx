"use client";

import { repositories } from "@/utils/actions/repositories";
import { useEffect, useState } from "react"; 

const Repository = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      // Fetch repositories once the username is set
      fetchRepositories(storedUsername);
    }
  }, []);

  const fetchRepositories = async (username: string) => {
    const repoData = await repositories(username);
    setRepos(repoData);
  };

  return (
    <div>
      <h2>Repositories for {username}</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Repository;
