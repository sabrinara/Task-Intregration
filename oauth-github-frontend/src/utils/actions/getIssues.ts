"use server";

export const getIssues = async (repoName: string, username: string, ) => {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/issues`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch issues");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching issues:", error);
        throw new Error("Failed to fetch issues");
    }
}