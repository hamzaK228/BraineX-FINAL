import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

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
    // Content counts
    contentUniversities,
    contentPrograms,
    contentScholarships,
    contentFields,
    contentProjects,
    contentRoadmaps,
    // Recent activity
    recentMessages,
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
      select: { id: true, name: true, email: true, role: true, tier: true, createdAt: true },
    }),
    prisma.contentUniversity.count(),
    prisma.contentProgram.count(),
    prisma.contentScholarship.count(),
    prisma.contentField.count(),
    prisma.contentProject.count(),
    prisma.contentRoadmap.count(),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, content: true, createdAt: true, sender: { select: { name: true } } },
    }),
  ]);

  // User growth — new users in last 7 days vs previous 7
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [usersThisWeek, usersLastWeek] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
  ]);

  const userGrowth = usersLastWeek > 0 ? ((usersThisWeek - usersLastWeek) / usersLastWeek * 100).toFixed(1) : "0";

  return NextResponse.json({
    users: { total: totalUsers, thisWeek: usersThisWeek, growth: `${userGrowth}%` },
    mentors: totalMentors,
    bookings: { total: totalBookings, pending: pendingBookings },
    messages: totalMessages,
    savedItems: totalSavedItems,
    recentUsers,
    recentMessages,
    content: {
      universities: contentUniversities,
      programs: contentPrograms,
      scholarships: contentScholarships,
      fields: contentFields,
      projects: contentProjects,
      roadmaps: contentRoadmaps,
      total: contentUniversities + contentPrograms + contentScholarships + contentFields + contentProjects + contentRoadmaps,
    },
  });
}
