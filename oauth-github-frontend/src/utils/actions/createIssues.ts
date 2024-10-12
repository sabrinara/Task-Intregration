"use server";

export const createIssues = async (repoName: string, username: string, title: string, body: string) => {
    try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/issues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

                "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                
            },
            body: JSON.stringify({
                
                title: title, 
                body: body,  
            }),
        });

        if (!res.ok) {
            throw new Error(`Failed to create issue: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error creating issue:", error);
        throw new Error("Failed to create issue");
    }
}
