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
            localStorage.removeItem("projectKey");
            localStorage.removeItem("projectName");
            console.log("Fetched projects:", projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };
    console.log(domain, email);

    const handleID = (id: number, name: string) => {
        localStorage.setItem("projectName", name.toString());
        localStorage.setItem("projectKey", id.toString());
    };

    return (
        <div>
            <h2 className="text-4xl my-6 text-center">Jira Projects </h2>
            <ul>
                {projects.map((project: Project) => (
                    <li key={project.id} className="border p-6 mb-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">

                                <div>
                                    <h3 className="font-bold text-sky-900 text-xl">{project.name}</h3>
                                    <p>Key: {project.key}</p>
                                    <p>Type: {project.projectTypeKey}</p>
                                </div>
                            </div>
                            <div>
                                <Link className="bg-sky-700 text-white px-4 py-2 rounded" href={`/jiraproject/${project.id}`}>
                                    <button onClick={() => handleID(project.id, project.name)}>View Project</button>
                                </Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JiraProject;
