"use server";

export const createBoard = async (
    domain: string,
    email: string,
    name: string,
    type: string,
    projectKey: string
) => {
    console.log("Creating board...", domain, email, name, type, projectKey);
    const token = process.env.JIRA_TOKEN;
    const credentials = Buffer.from(`${email}:${token}`).toString("base64");
    try {
        const res = await fetch(`${domain}/rest/agile/1.0/board`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                type,
                filterId : projectKey,
                location: {
                    projectKeyOrId : projectKey,
                    type: "project",
                },
            }),
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to create board: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error creating board:", error);
        throw new Error("Failed to create board");
    }
};
