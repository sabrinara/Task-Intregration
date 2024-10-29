"use client";

import { useState, useEffect } from "react";
import { getAllProject } from '@/utils/actions/getAllProject'; 
import Link from "next/link";


interface Project {
    id: number;
    name: string;
    key: string;
    projectTypeKey: string;
    self: string;
}
const JiraProject = () => {
    const [projects, setProjects] = useState([]); 
    const [domain, setDomain] = useState("");
    const [email, setEmail] = useState("");


    useEffect(() => {
        const jiraInstanceURL = localStorage.getItem("jiraInstanceURL");
        const userEmail = localStorage.getItem("email");

        setDomain(jiraInstanceURL as string);
        setEmail(userEmail as string);

        if (jiraInstanceURL && userEmail) {
            fetchAllProjects(jiraInstanceURL, userEmail);
        }
    }, []);
    const fetchAllProjects = async (domain: string, email: string) => {
        try {
            const projects = await getAllProject(domain, email);
            setProjects(projects);
        
            console.log("Fetched projects:", projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };
console.log(domain, email);
    
const handleID = (id: number) => {
    localStorage.setItem("projectKey", id.toString());
};

    return (
        <div>
            <h2 className="text-2xl mb-4">Jira Projects </h2>
            <ul>
                {projects.map((project : Project) => (
                    <li key={project.id} className="border p-4 mb-2">
                        <div className="flex items-center">
                       
                            <div>
                                <h3 className="font-bold">{project.name}</h3>
                                <p>Key: {project.key}</p>
                                <p>Type: {project.projectTypeKey}</p>
                            </div>
                        </div>
                       <Link className="text-blue-500" href={`/jiraproject/${project.id}`}>
                       <button  onClick={() => handleID(project.id)}>View Project</button>
                       </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JiraProject;
