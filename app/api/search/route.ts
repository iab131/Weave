import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const handle = searchParams.get("handle");

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    // Use SerpAPI (Google Search API) to get LinkedIn or Instagram links
    const searchQuery = `${name} ${handle || ""} site:linkedin.com`;
    const apiKey = "d9f6a0aaf09287868cb5f4ba6b9aba301185bdf3d8e6938c0400793ef1702f22"; // Get this from SerpAPI
    const response = await axios.get(
      `https://serpapi.com/search.json?q=${encodeURIComponent(searchQuery)}&api_key=${apiKey}`
    );

    const result = response.data.organic_results[0]; // First result
    const profileLink = result?.link;

    return NextResponse.json({ profileLink });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
