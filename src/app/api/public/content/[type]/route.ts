
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MODEL_MAP: Record<string, string> = {
  universities: "contentUniversity",
  programs: "contentProgram",
  scholarships: "contentScholarship",
  fields: "contentField",
  projects: "contentProject",
  roadmaps: "contentRoadmap",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const modelName = MODEL_MAP[type];

    if (!modelName) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    let where: any = { isPublished: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
      
      // Some models use 'name' instead of 'title'
      if (type === "universities") {
        where.OR.push({ name: { contains: search, mode: "insensitive" } });
      }
    }

    const orderBy: any = type === "universities" ? { ranking: "asc" } : { createdAt: "desc" };

    const [items, total] = await Promise.all([
      (prisma as any)[modelName].findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      (prisma as any)[modelName].count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Public content API error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch content", 
      details: error.message 
    }, { status: 500 });
  }
}
