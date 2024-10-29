"use server";
export const createBoard = async (
    domain: string,
    email: string,
    name: string,
    type: string,
    filterId: number,
    projectKeyOrId: number
) => {
    const token = process.env.JIRA_TOKEN;
    try {
        const res = await fetch(`${domain}/rest/agile/1.0/board`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                type,
                filterId,
                location: {
                    projectKeyOrId: projectKeyOrId.toString(),
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
