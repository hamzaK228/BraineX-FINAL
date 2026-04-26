import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/mentors — List verified mentors (public)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const expertise = searchParams.get("expertise");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  const where: any = { isVerified: true };

  if (expertise) {
    where.expertise = { has: expertise };
  }

  if (search) {
    where.OR = [
      { bio: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [mentors, total] = await Promise.all([
    prisma.mentorProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        slots: { where: { isActive: true } },
      },
      orderBy: { rating: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.mentorProfile.count({ where }),
  ]);

  return NextResponse.json({
    mentors,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
