import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"]),
});

// PATCH /api/bookings/[id] — Update booking status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      mentor: { include: { user: true } },
      student: true,
    },
  });

  if (!booking)
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Only mentor can confirm/complete, both can cancel
  const isMentor = booking.mentor.userId === session.user.id;
  const isStudent = booking.studentId === session.user.id;

  if (!isMentor && !isStudent)
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  if (parsed.data.status === "confirmed" && !isMentor)
    return NextResponse.json({ error: "Only the mentor can confirm" }, { status: 403 });

  if (parsed.data.status === "completed" && !isMentor)
    return NextResponse.json({ error: "Only the mentor can mark complete" }, { status: 403 });

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  // Notify the other party
  const notifyUserId = isMentor ? booking.studentId : booking.mentor.userId;
  const actorName = isMentor ? booking.mentor.user.name : booking.student.name;
  await prisma.notification.create({
    data: {
      userId: notifyUserId,
      title: `Booking ${parsed.data.status}`,
      message: `${actorName || "User"} has ${parsed.data.status} the session.`,
      type: "alert",
    },
  });

  return NextResponse.json(updated);
}
