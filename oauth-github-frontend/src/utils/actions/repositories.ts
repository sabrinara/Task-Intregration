"use server";

export const repositories = async (username: string) => {
  const repos = await fetch(`https://api.github.com/users/${username}/repos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
   
    },
    cache: "no-store",
  });
  if (!repos.ok) {
    throw new Error("Failed to fetch repositories");
  }
  const data = await repos.json();
  return data;
};
