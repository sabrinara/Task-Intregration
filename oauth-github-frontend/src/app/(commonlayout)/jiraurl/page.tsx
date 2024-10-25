"use client";

import { useEffect, useState } from "react";
import { getJiraInstance } from "@/utils/actions/getJiraInstance"; 


const JiraUrl = () => {
    const [jiraUrll, setJiraUrll] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  

    useEffect(() => {
        const fetchJiraUrll = async () => {
            
            setLoading(true);
            try {
                const url = await getJiraInstance();
                setJiraUrll(url);
            } catch (error) {
                setError("Failed to fetch Jira URL.");
                console.error("Error:", error);
            }
             finally {
                setLoading(false);
            }
        };

        fetchJiraUrll();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Your Jira Instance URL</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {jiraUrll && (
                <p className="mt-4">
                    Jira URL: <a href={jiraUrll} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{jiraUrll}</a>
                </p>
            )}
        </div>
    );
};

export default JiraUrl;
