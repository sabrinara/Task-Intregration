
"use server";

import { UserType } from "@/app/page";

export const loginUser = async (data: UserType) => {
    // console.log("data:", data);
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });


        if (!res.ok) {
            throw new Error(`Failed to log in: ${res.status} ${res.statusText}`);
        }


        const userInfo = await res.json();
      
        console.log("userInfo:", userInfo);
        return userInfo;
    } catch (error) {
        console.error("Error saving user info:", error);
        throw new Error("Failed to save user info");
    }
}
