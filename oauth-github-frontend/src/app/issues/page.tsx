"use client";

import { createIssues } from "@/utils/actions/createIssues";
import { getIssues } from "@/utils/actions/getIssues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Issue {
  id: number; 
  title: string;
  body: string;
  state: string;
}

const CreateIssuesPage = () => {
  const [repoName, setRepoName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [issueTitle, setIssueTitle] = useState<string>("");
  const [issueBody, setIssueBody] = useState<string>("");
  const [issues, setIssues] = useState<Issue[]>([]); 

  useEffect(() => {
    const storedRepoName = localStorage.getItem("repo");
    const storedUsername = localStorage.getItem("username");

    setRepoName(storedRepoName);
    setUsername(storedUsername);

    if (storedRepoName && storedUsername) {
      getIssueData(storedRepoName, storedUsername); 
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 

    if (repoName && username) {
      try {
        const issueData = await createIssues(repoName, username, issueTitle, issueBody);
        console.log("Issue created:", issueData);
        
        await getIssueData(repoName, username);
        setIssueTitle("");
        setIssueBody("");

       toast.success("Issue created successfully!");
        localStorage.removeItem("repo");

      } catch (error) {
        console.error("Error creating issue:", error);
      }
    }
  };

  const getIssueData = async (repoName: string, username: string) => {
    try {
      const issuesData = await getIssues(repoName, username);
      setIssues(issuesData); 
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  return (
    <div className="w-[90%] mx-auto my-10">
      <h2 className="text-4xl text-center">Create Issue for Repository: {repoName}</h2>
      <p className="text-sky-900 mt-10 mb-5">Username: {username}</p>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="border border-gray-300 p-2 rounded"
            value={issueTitle}
            onChange={(e) => setIssueTitle(e.target.value)} 
          />
          <textarea
            name="body"
            placeholder="Body"
            className="border border-gray-300 p-2 rounded"
            value={issueBody}
            onChange={(e) => setIssueBody(e.target.value)} 
          />
          <button type="submit" className="border border-gray-300 p-2 rounded bg-sky-50">
            Submit Issue
          </button>
        </form>
      </div>
      <div className="mt-10">
        <h3>Submitted Issues:</h3>
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>
              <h4>{issue.title}</h4>
              <p>{issue.body}</p>
              <p>Status: {issue.state}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateIssuesPage;
