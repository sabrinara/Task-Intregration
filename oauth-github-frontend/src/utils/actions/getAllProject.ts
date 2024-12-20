"use server";

export const getAllProject = async (domain: string, email: string) => {
    const url = `${domain}/rest/api/3/project`;

    const token = process.env.JIRA_TOKEN;
    const credentials = Buffer.from(`${email}:${token}`).toString("base64");
    
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        
        if (!res.ok) {
            throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Failed to fetch projects");
    }
};
