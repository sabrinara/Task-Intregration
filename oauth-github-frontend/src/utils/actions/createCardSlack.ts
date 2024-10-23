"use server";

export const createCardSlack = async (channel: string, title: string, message: string) => {
    try {
        const res = await fetch(`https://slack.com/api/chat.postMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`, 
            },
            body: JSON.stringify({
                channel: channel, 
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*${title}*\n${message}`, 
                        },
                    },
                ],
            }),
        });

        if (!res.ok) {
            throw new Error(`Failed to post card: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error posting card to Slack:", error);
        throw new Error("Failed to post card");
    }
}
