"use server";

export const getJiraInstance = async () => {
    try {
       const res = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
          method: "GET",
          headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${process.env.JIRA_API_TOKEN}`,
          },
       });
 
       if (!res.ok) {
          const errorDetails = await res.json();
          throw new Error(`Failed to fetch Jira instances: ${res.status} ${res.statusText}. Details: ${JSON.stringify(errorDetails)}`);
       }
 
       const data = await res.json();
       if (data.length > 0) {
          return data[0].url;
       } else {
          throw new Error("No Jira instances found");
       }
    } catch (error) {
       console.error("Error fetching Jira instance:", error);
       throw new Error("Failed to fetch Jira instance");
    }
 };
 
