"use client";

import { useState } from "react";
import { toast } from "sonner"; 
import { createCardSlack } from "@/utils/actions/createCardSlack"; 

const SlackCard = () => {
    const [channel, setChannel] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
          
            const response = await createCardSlack(channel, title, message);
            if (response.ok) {
                toast.success(`Card posted to ${channel}`);
            } else {
                toast.error("Failed to post the card.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error posting card to Slack");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">Post Card to Slack</h2>
            
            <div className="mb-4">
                <label htmlFor="channel" className="block text-gray-700">Channel</label>
                <input
                    type="text"
                    id="channel"
                    className="w-full px-3 py-2 border rounded-md"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    placeholder="#general or C01..."
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    className="w-full px-3 py-2 border rounded-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter card title"
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700">Message</label>
                <textarea
                    id="message"
                    className="w-full px-3 py-2 border rounded-md"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter card message"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={loading}
            >
                {loading ? 'Posting...' : 'Post Card'}
            </button>
        </div>
    );
};

export default SlackCard;
