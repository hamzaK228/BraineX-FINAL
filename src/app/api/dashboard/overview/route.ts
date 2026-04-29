import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/overview — Consolidated endpoint for the dashboard overview page
export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const now = new Date();

  // Start of current week (Monday)
  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  // End of current month for deadline counting
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  try {
    const [
      user,
      // Counts for stats
      goalsCount,
      tasksTotal,
      tasksDone,
      scholarshipsCount,
      deadlinesThisMonth,
      eventsCount,
      programsCount,
      resourcesCount,
      roadmapsCount,
      universitiesCount,
      // Actual data for widgets
      goals,
      tasks,
      weekEvents,
      upcomingDeadlines,
      savedUniversities,
      savedPrograms,
      userResources,
      userRoadmaps,
    ] = await Promise.all([
      // User info
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
      // Stats counts
      prisma.goal.count({ where: { userId } }),
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: "done" } }),
      prisma.scholarshipTracker.count({ where: { userId } }),
      prisma.deadline.count({ where: { userId, date: { lte: endOfMonth, gte: now } } }),
      prisma.plannerEvent.count({ where: { userId } }),
      prisma.programTracker.count({ where: { userId } }),
      prisma.resource.count({ where: { userId } }),
      prisma.roadmap.count({ where: { userId } }),
      prisma.universityTracker.count({ where: { userId } }),
      // Goals (top 4)
      prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { id: true, title: true, progress: true, targetDate: true },
      }),
      // Tasks (top 5)
      prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, status: true, priority: true },
      }),
      // This week's planner events
      prisma.plannerEvent.findMany({
        where: { userId, date: { gte: startOfWeek, lt: endOfWeek } },
        orderBy: { date: "asc" },
        select: { id: true, title: true, date: true, time: true, type: true },
      }),
      // Upcoming deadlines (next 5)
      prisma.deadline.findMany({
        where: { userId, date: { gte: now } },
        orderBy: { date: "asc" },
        take: 5,
        select: { id: true, title: true, date: true, course: true },
      }),
      // Saved universities (top 3)
      prisma.universityTracker.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, name: true, location: true, status: true },
      }),
      // Saved programs (top 3)
      prisma.programTracker.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, name: true, university: true, status: true },
      }),
      // User resources (top 3)
      prisma.resource.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, title: true, type: true, link: true },
      }),
      // User roadmaps with steps
      prisma.roadmap.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          steps: { select: { id: true, isCompleted: true } },
        },
      }),
    ]);

    // Process roadmaps to calculate progress
    const roadmapsWithProgress = userRoadmaps.map((r) => {
      const totalSteps = r.steps.length;
      const completedSteps = r.steps.filter((s) => s.isCompleted).length;
      const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        totalSteps,
        completedSteps,
        progress,
      };
    });

    // Process week events into a day-grouped format for the Weekly Schedule widget
    const weekSchedule: Record<string, any[]> = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toDateString();
      weekSchedule[dateStr] = [];
    }
    weekEvents.forEach((ev) => {
      const dateStr = new Date(ev.date).toDateString();
      if (weekSchedule[dateStr]) {
        weekSchedule[dateStr].push({
          id: ev.id,
          title: ev.title,
          time: ev.time || "All Day",
          type: ev.type,
        });
      }
    });

    // Build weekly schedule array
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toDateString();
      weekDays.push({
        day: dayNames[d.getDay()],
        date: d.getDate().toString(),
        fullDate: d.toISOString(),
        isToday: d.toDateString() === now.toDateString(),
        events: weekSchedule[dateStr] || [],
      });
    }

    return NextResponse.json({
      userName: user?.name?.split(" ")[0] || "there",
      stats: {
        goals: goalsCount,
        tasks: { total: tasksTotal, done: tasksDone },
        scholarships: scholarshipsCount,
        deadlines: deadlinesThisMonth,
        events: eventsCount,
        programs: programsCount,
        resources: resourcesCount,
        roadmaps: roadmapsCount,
        universities: universitiesCount,
      },
      goals: goals.map((g) => ({
        id: g.id,
        text: g.title,
        progress: g.progress,
        completed: g.progress >= 100,
        category: "General",
      })),
      tasks: tasks.map((t) => ({
        id: t.id,
        text: t.title,
        done: t.status === "completed" || t.status === "done",
        priority: t.priority,
      })),
      weekSchedule: weekDays,
      upcomingDeadlines: upcomingDeadlines.map((d) => ({
        id: d.id,
        title: d.title,
        date: d.date,
        course: d.course,
      })),
      savedUniversities,
      savedPrograms,
      resources: userResources,
      roadmaps: roadmapsWithProgress,
    });
  } catch (error) {
    console.error("[DASHBOARD_OVERVIEW]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
