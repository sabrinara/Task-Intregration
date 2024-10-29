"use client";

import { useState, useEffect } from "react";
import { createBoard } from "@/utils/actions/createBoard";
import { getAllBoard } from "@/utils/actions/getAllBoard";
import { toast } from "sonner";

interface JiraBoard {
    id: number;
    name: string;
    type: string;
    self: string;
    location: { projectId: number; displayName: string; projectKey: string; projectTypeKey: string; avatarURI: string; projectName: string; name: string };
    filterId?: number; // assuming filterId is available in the board details
}

const JiraUrl = () => {
    const [boardName, setBoardName] = useState("");
    const [boardType, setBoardType] = useState("scrum");
    const [allBoards, setAllBoards] = useState<JiraBoard[]>([]);
    const [createdBoard, setCreatedBoard] = useState<JiraBoard | null>(null);
    const [domain, setDomain] = useState("");
    const [email, setEmail] = useState("");
    const [filterId, setFilterId] = useState<number | null>(null);
    const [projectKeyOrId, setProjectKeyOrId] = useState<number | null>(null);
    const [selectedBoard, setSelectedBoard] = useState<JiraBoard | null>(null);

    useEffect(() => {
        const jiraInstanceURL = localStorage.getItem("jiraInstanceURL");
        const userEmail = localStorage.getItem("email");

        setDomain(jiraInstanceURL as string);
        setEmail(userEmail as string);

        if (jiraInstanceURL && userEmail) {
            fetchAllBoards(jiraInstanceURL, userEmail);
        }
    }, []);

    const fetchAllBoards = async (domain: string, email: string) => {
        try {
            const boards = await getAllBoard(domain, email);
            setAllBoards(boards);
            console.log("Fetched boards:", boards);
        } catch (error) {
            console.error("Error fetching boards:", error);
        }
    };

    const handleBoardSelect = (boardId: number) => {
        const board = allBoards.find((b) => b.id === boardId);
        if (board) {
            setSelectedBoard(board);
            setProjectKeyOrId(board.location.projectId);
            setFilterId(board.location.projectId || null); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!filterId || !projectKeyOrId) {
                console.error("Filter ID and Project Key/ID are required.");
                return;
            }
            const board = await createBoard(domain, email, boardName, boardType, filterId, projectKeyOrId);
            setCreatedBoard(board);
            setBoardName("");
            fetchAllBoards(domain, email);
            toast.success("Board created successfully!");
        } catch (error) {
            console.error("Error creating board:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-4xl mb-4 text-center">All Jira Projects</h2>
            <ul>
                {allBoards.map((board) => (
                    <li key={board.id}>
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl mb-2">Project Name: {board.location?.projectName}</h1>
                            <h1 className="text-xl mb-2">Project Type: {board.location?.projectTypeKey}</h1>
                        </div>
                        <a href={board.self} target="_blank" rel="noopener noreferrer">
                            Board Name: {board.location?.displayName}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Select Existing Board */}
            <h2 className="text-2xl mb-4 mt-6">Select Existing Board for Project and Filter ID</h2>
            <select
                onChange={(e) => handleBoardSelect(parseInt(e.target.value))}
                className="border p-2 w-full mb-4"
                value={selectedBoard?.id || ""}
            >
                <option value="" disabled>Select a Board</option>
                {allBoards.map((board) => (
                    <option key={board.id} value={board.id}>
                        {board.name} - {board.location?.projectName}
                    </option>
                ))}
            </select>

            {/* Form to create a new board */}
            <h2 className="text-2xl mb-4 mt-6">Create a New Jira Board</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Board Name</label>
                    <input
                        type="text"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Board Type</label>
                    <select
                        value={boardType}
                        onChange={(e) => setBoardType(e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="scrum">Scrum</option>
                        <option value="kanban">Kanban</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Filter ID</label>
                    <input
                        type="number"
                        value={filterId || ""}
                        onChange={(e) => setFilterId(parseInt(e.target.value))}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Project Key/ID</label>
                    <input
                        type="number"
                        value={projectKeyOrId || ""}
                        onChange={(e) => setProjectKeyOrId(parseInt(e.target.value))}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create Board</button>
            </form>

            {/* Show created board details */}
            {createdBoard && (
                <div className="mt-6 p-4 bg-gray-100 rounded">
                    <h3 className="text-xl font-bold">Created Board Details:</h3>
                    <p><strong>ID:</strong> {createdBoard.id}</p>
                    <p><strong>Name:</strong> {createdBoard.name}</p>
                    <p><strong>Type:</strong> {createdBoard.type}</p>
                    <p>
                        <strong>Link:</strong>{" "}
                        <a href={createdBoard.self} target="_blank" className="text-blue-500 underline">
                            {createdBoard.self}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default JiraUrl;
