"use server";

export const getAProjectBoard = async (domain: string, email: string , projectKey: string) => {
    console.log( domain, email, projectKey );

    const url = `${domain}/rest/agile/1.0/board/filter/${projectKey}`;

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
            throw new Error(`Failed to fetch boards: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data.values;
    } catch (error) {
        console.error("Error fetching boards:", error);
        throw new Error("Failed to fetch boards");
    }
};