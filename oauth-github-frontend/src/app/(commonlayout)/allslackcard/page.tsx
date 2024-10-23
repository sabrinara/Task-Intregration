"use client";

import { useState } from "react";
import { getCardSlack } from "@/utils/actions/getCardSlack"; 

const FetchSlackCards = () => {
    const [channel, setChannel] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]); 
    const [loading, setLoading] = useState<boolean>(false);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await getCardSlack(channel);
            setMessages(response); 
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">Fetch Cards from Slack</h2>
            
            <div className="mb-4">
                <label htmlFor="channel" className="block text-gray-700">Channel</label>
                <input
                    type="text"
                    id="channel"
                    className="w-full px-3 py-2 border rounded-md"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    placeholder="Enter channel ID (e.g., C01...)"
                />
            </div>

            <button
                onClick={fetchMessages}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={loading}
            >
                {loading ? 'Fetching...' : 'Fetch Messages'}
            </button>

            {messages.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-xl mb-4">Messages:</h3>
                    <ul className="list-disc ml-6">
                        {messages.map((msg, index) => (
                            <li key={index}>
                                <strong>User:</strong> {msg.user} <br />
                                <strong>Text:</strong> {msg.text} <br />
                                <strong>Timestamp:</strong> {msg.ts}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FetchSlackCards;
