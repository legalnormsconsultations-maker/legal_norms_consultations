import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { SearchService } from "@/services/search.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await SearchService.globalSearch(query, 10);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Global search failed:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again later." },
      { status: 500 },
    );
  }
}
