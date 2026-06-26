import { NextResponse } from "next/server";
import { getArtworks } from "@/lib/artworks";

// Same-origin proxy so the client component (the home gallery) can read the
// artworks without exposing the backend URL or dealing with CORS.
export async function GET() {
  try {
    const artworks = await getArtworks();
    return NextResponse.json({ artworks });
  } catch {
    return NextResponse.json({ artworks: [] });
  }
}
