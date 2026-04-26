import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/bookings — User's bookings (as student or mentor)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get mentor profile if exists
  const mentorProfile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Build query — show bookings where user is student OR mentor
  const where: any = { OR: [{ studentId: session.user.id }] };
  if (mentorProfile) {
    where.OR.push({ mentorId: mentorProfile.id });
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      mentor: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      student: { select: { id: true, name: true, image: true } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(bookings);
}
