import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  // Simulate a delay for the "indication" to be visible
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Mock results for now
  // In a real implementation, this would call Google Custom Search API
  const mockResults = [
    {
      title: `${query} - Global Academic Information`,
      link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      snippet: `Find the latest information about ${query} including admissions, rankings, and program details on the official websites.`,
    },
    {
      title: `Top Scholarships for ${query} students`,
      link: `https://www.google.com/search?q=${encodeURIComponent(query)}+scholarships`,
      snippet: `Explore various funding opportunities and financial aid packages available for students pursuing ${query}.`,
    }
  ];

  return NextResponse.json({
    query,
    results: mockResults,
    message: "Results fetched from Google (Mock Data)"
  });
}
