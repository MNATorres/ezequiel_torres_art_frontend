export interface Experience {
  _id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.API_URL ?? "http://localhost:3000";

/**
 * Fetches the trajectory experiences from the backend. Runs on the server
 * (public GET, no auth). `no-store` keeps it fresh so manager edits show up
 * immediately.
 */
export async function getExperiences(): Promise<Experience[]> {
  const res = await fetch(`${API_URL}/api/experiences`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load experiences: ${res.status}`);
  }
  return res.json();
}
