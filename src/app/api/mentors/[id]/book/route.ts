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

// POST /api/mentors/[id]/book — Book a session
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: mentorId } = await params;

  // Verify mentor exists
  const mentor = await prisma.mentorProfile.findUnique({
    where: { id: mentorId },
    include: { user: { select: { id: true, name: true } } },
  });
  if (!mentor)
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });

  // Prevent self-booking
  if (mentor.userId === session.user.id)
    return NextResponse.json({ error: "Cannot book yourself" }, { status: 400 });

  const body = await req.json();
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  const bookingDate = new Date(parsed.data.date);

  // Check for conflicting bookings
  const conflict = await prisma.booking.findFirst({
    where: {
      mentorId,
      date: bookingDate,
      startTime: parsed.data.startTime,
      status: { in: ["pending", "confirmed"] },
    },
  });
  if (conflict)
    return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 });

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      mentorId,
      studentId: session.user.id,
      date: bookingDate,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      notes: parsed.data.notes || null,
      status: "pending",
    },
  });

  // Create a notification for the mentor
  await prisma.notification.create({
    data: {
      userId: mentor.userId,
      title: "New Booking Request",
      message: `${session.user.name || "A student"} has requested a session on ${parsed.data.date} at ${parsed.data.startTime}.`,
      type: "alert",
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
