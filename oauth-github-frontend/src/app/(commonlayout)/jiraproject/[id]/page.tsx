"use client"

import { useState, useEffect } from "react";
import { getAProjectBoard } from "@/utils/actions/getAProjectBoard";
import { createBoard } from "@/utils/actions/createBoard";
import { toast } from "sonner";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [boardName, setBoardName] = useState("");
    const [boardType, setBoardType] = useState("scrum");
    const projectName = localStorage.getItem("projectName");

    useEffect(() => {
        const jiraInstanceURL = localStorage.getItem("jiraInstanceURL");
        const userEmail = localStorage.getItem("email");
        const projectId = localStorage.getItem("projectKey");

        setDomain(jiraInstanceURL as string);
        setEmail(userEmail as string);
        setProjectKey(projectId as string);

        if (jiraInstanceURL && userEmail && projectId) {
            fetchBoards(jiraInstanceURL, userEmail, projectId);
        }
    }, []);

    const fetchBoards = async (domain: string, email: string, projectKey: string) => {
        try {
            const boards = await getAProjectBoard(domain, email, projectKey);
            setBoards(boards);
        } catch (error) {
            console.error("Error fetching boards:", error);
        }
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddBoard = async (e: React.FormEvent) => {
        e.preventDefault();
      
        try {
          
            const board = await createBoard(domain, email, boardName, boardType, projectKey);
            toast.success("Board created successfully!");
            setBoards((prevBoards) => [...prevBoards, board]);
            setBoardName("");
            setIsModalOpen(false); 
            console.log("New board added:", boardName);
        } catch (error) {
            console.error("Error creating board:", error);
        }
    };
    console.log(projectKey);

    return (
        <div>
            <h2 className="text-4xl mt-4 mb-10 text-center">
                All Boards of Project <span className="text-red-500">{projectName}</span>
            </h2>
            {boards.length ? (
                <div className="grid grid-cols-5 gap-4">
                     {boards.map((board) => (
                        <div key={board.id} className="border p-8 mb-2 rounded bg-sky-50">
                            <h3 className="font-semibold text-xl">{board.name}</h3>
                          
                        </div>
                    ))}
                </div>
            ) : (
                <p>No boards found for this project.</p>
            )}
            <div>
                <button
                    className="bg-sky-900 text-white px-4 py-2 rounded mt-4"
                    onClick={handleModalOpen}
                >
                    Create New Board
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                       <div className="flex justify-between mb-4">
                       <h3 className="text-xl font-bold text-sky-800">Add New Board</h3>
                        <button
                            className=" text-gray-500 text-lg "
                            onClick={handleModalClose}
                        >
                            x
                        </button>
                       </div>
                        <form onSubmit={handleAddBoard} className="space-y-4">
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
              
                           <div className="flex justify-end">
                           <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
                                Create Board
                            </button>
                           </div>
                        </form>
                       
                    </div>
                </div>
            )}
        </div>
    );
};

export default JiraBoard;
