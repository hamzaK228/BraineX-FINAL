import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookSchema = z.object({
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  notes: z.string().optional(),
});

// GET /api/mentors/[id] — Mentor profile + available slots
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const mentor = await prisma.mentorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true, email: true } },
      slots: { where: { isActive: true }, orderBy: { dayOfWeek: "asc" } },
    },
  });

  if (!mentor)
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });

  return NextResponse.json(mentor);
}
