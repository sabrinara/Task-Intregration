"use server";
export const getJiraInstance = async (access_token: string) => {
    if (!access_token) {
      throw new Error("Access token not found");
    }
  
    const response = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
  
    const data = await response.json();
  
    if (data && data.length > 0) {
      const { url, id } = data[0];
      console.log("Jira instance URL:", url, id);
      return url; // Return the Jira instance URL
    } else {
      throw new Error("Unable to retrieve Jira instance URL.");
    }
  };
  