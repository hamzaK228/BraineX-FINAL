import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/stats — Platform-wide statistics
export async function GET() {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [
    totalUsers,
    totalMentors,
    totalBookings,
    pendingBookings,
    totalMessages,
    totalSavedItems,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.mentorProfile.count({ where: { isVerified: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.message.count(),
    prisma.savedItem.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    users: totalUsers,
    mentors: totalMentors,
    bookings: { total: totalBookings, pending: pendingBookings },
    messages: totalMessages,
    savedItems: totalSavedItems,
    recentUsers,
  });
}
