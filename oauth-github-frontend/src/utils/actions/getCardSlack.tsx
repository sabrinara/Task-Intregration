"use server";

export const getCardSlack = async (channel: string) => {
    try {
       
        const url = `https://slack.com/api/conversations.history?channel=${channel}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`, 
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch messages: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data.messages; 
    } catch (error) {
        console.error("Error fetching messages from Slack:", error);
        throw new Error("Failed to fetch messages");
    }
};
