export interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.API_URL ?? "http://localhost:3000";

/**
 * Fetches the "Arte en Vivo" gallery artworks from the backend. Runs on the
 * server (public GET, no auth). `no-store` keeps it fresh so manager edits show
 * up immediately. Backend returns them ordered by `order` ascending.
 */
export async function getArtworks(): Promise<Artwork[]> {
  const res = await fetch(`${API_URL}/api/artworks`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load artworks: ${res.status}`);
  }
  return res.json();
}
