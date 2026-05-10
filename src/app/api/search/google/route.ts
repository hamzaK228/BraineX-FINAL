import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  // Keep a minimal 1-second delay so the beautiful loader animation is visible
  // even if the API responds extremely fast.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    console.error("Missing Google Search API credentials");
    // Fallback to mock data if keys are not configured yet
    const mockResults = [
      {
        title: `${query} - Global Academic Information`,
        link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Find the latest information about ${query} including admissions, rankings, and program details. (Add API keys for real results)`,
      }
    ];
    return NextResponse.json({
      query,
      results: mockResults,
      message: "Warning: Missing API keys. Showing mock data."
    });
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`;
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Google API Error:", errorData);
      throw new Error(errorData.error?.message || "Failed to fetch from Google API");
    }

    const data = await res.json();
    
    // Map Google API format to our expected format
    const results = (data.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    return NextResponse.json({
      query,
      results,
      message: "Results fetched successfully"
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message || "Failed to perform search" }, { status: 500 });
  }
}

