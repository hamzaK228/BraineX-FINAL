import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const [
    goalsCount,
    tasksTotal,
    tasksDone,
    notesCount,
    deadlinesCount,
    universitiesCount,
    scholarshipsCount,
    unreadNotifications,
    eventsCount,
    programsCount,
    resourcesCount,
    roadmapsCount,
  ] = await Promise.all([
    prisma.goal.count({ where: { userId } }),
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: "done" } }),
    prisma.note.count({ where: { userId } }),
    prisma.deadline.count({ where: { userId } }),
    prisma.universityTracker.count({ where: { userId } }),
    prisma.scholarshipTracker.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.plannerEvent.count({ where: { userId } }),
    prisma.programTracker.count({ where: { userId } }),
    prisma.resource.count({ where: { userId } }),
    prisma.roadmap.count({ where: { userId } }),
  ]);

  return NextResponse.json({
    goals: goalsCount,
    tasks: { total: tasksTotal, done: tasksDone },
    notes: notesCount,
    deadlines: deadlinesCount,
    universities: universitiesCount,
    scholarships: scholarshipsCount,
    unreadNotifications,
    events: eventsCount,
    programs: programsCount,
    resources: resourcesCount,
    roadmaps: roadmapsCount,
  });
}
