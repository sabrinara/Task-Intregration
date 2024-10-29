"use client";

import { useState, useEffect } from "react";
import { getAProjectBoard } from "@/utils/actions/getAProjectBoard";

interface Board {
    id: number;
    name: string;
    type: string;
}

const JiraBoard = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [domain, setDomain] = useState("");
    const [email, setEmail] = useState("");
    const [projectKey, setProjectKey] = useState("");

    useEffect(() => {
        const jiraInstanceURL = localStorage.getItem("jiraInstanceURL");
        const userEmail = localStorage.getItem("email");
        const projectId = localStorage.getItem("projectKey");

        setDomain(jiraInstanceURL as string);
        setEmail(userEmail as string);
        setProjectKey(projectId as string);

        if (jiraInstanceURL && userEmail && projectId) {
            fetchBoards(jiraInstanceURL, userEmail, projectId );
        }
    }, []);

    const fetchBoards = async (domain: string, email: string, projectKey: string) => {
        try {
            const boards = await getAProjectBoard(domain, email, projectKey );
            setBoards(boards);

            console.log("Fetched boards:", boards);
        } catch (error) {
            console.error("Error fetching boards:", error);
        } 
    };

  

    console.log(domain, email, projectKey);

    return (
        <div>
            <h2 className="text-2xl mb-4">Boards for Project: {}</h2>
            {boards.length ? (
                <ul>
                    {boards.map((board) => (
                        <li key={board.id} className="border p-4 mb-2">
                            <h3 className="font-bold">{board.name}</h3>
                            <p>Type: {board.type}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No boards found for this project.</p>
            )}
        </div>
    );
};

export default JiraBoard;
