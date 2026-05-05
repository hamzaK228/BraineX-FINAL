// Seed script: Populate dashboard tables with demo data for the first user
// Run with: npx tsx scripts/seed-dashboard.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find the first user (or the one specified via env)
  const userEmail = process.env.SEED_USER_EMAIL;
  let user;

  if (userEmail) {
    user = await prisma.user.findUnique({ where: { email: userEmail } });
  } else {
    user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  }

  if (!user) {
    console.error("No user found. Create a user first or set SEED_USER_EMAIL.");
    process.exit(1);
  }

  console.log(`Seeding data for user: ${user.email} (${user.id})`);

  const userId = user.id;
  const now = new Date();

  // ─── Goals ───
  const goals = [
    { title: "Complete SAT Preparation", progress: 65, targetDate: new Date(now.getFullYear(), 5, 15) },
    { title: "Apply to 5 Universities", progress: 40, targetDate: new Date(now.getFullYear(), 11, 1) },
    { title: "Get IELTS Score 7.5+", progress: 80, targetDate: new Date(now.getFullYear(), 3, 30) },
    { title: "Build Portfolio Website", progress: 25, targetDate: new Date(now.getFullYear(), 6, 1) },
  ];

  for (const g of goals) {
    await prisma.goal.create({ data: { userId, ...g } });
  }
  console.log(`✓ Created ${goals.length} goals`);

  // ─── Tasks ───
  const tasks = [
    { title: "Research scholarship deadlines", status: "completed", priority: "High" },
    { title: "Write personal statement draft", status: "in_progress", priority: "High" },
    { title: "Request recommendation letters", status: "todo", priority: "Medium" },
    { title: "Prepare for TOEFL exam", status: "in_progress", priority: "High" },
    { title: "Review university application requirements", status: "completed", priority: "Medium" },
    { title: "Update resume/CV", status: "todo", priority: "Low" },
    { title: "Attend virtual campus tour", status: "todo", priority: "Low" },
  ];

  for (const t of tasks) {
    await prisma.task.create({ data: { userId, ...t } });
  }
  console.log(`✓ Created ${tasks.length} tasks`);

  // ─── Deadlines ───
  const deadlines = [
    { title: "Early Decision Application - MIT", date: new Date(now.getFullYear(), 10, 1), course: "Computer Science" },
    { title: "Fulbright Scholarship Deadline", date: new Date(now.getFullYear(), 9, 11), course: "General" },
    { title: "SAT Registration Deadline", date: new Date(now.getFullYear(), 4, 15), course: "Testing" },
    { title: "Stanford Regular Decision", date: new Date(now.getFullYear() + 1, 0, 5), course: "Engineering" },
    { title: "Financial Aid Application Due", date: new Date(now.getFullYear(), 11, 15), course: "General" },
  ];

  for (const d of deadlines) {
    await prisma.deadline.create({ data: { userId, ...d } });
  }
  console.log(`✓ Created ${deadlines.length} deadlines`);

  // ─── Planner Events (Weekly Schedule) ───
  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const events = [
    { dayOffset: 0, title: "Study Group - Calculus", type: "meeting", time: "14:00" },
    { dayOffset: 1, title: "SAT Practice Test", type: "task", time: "09:00" },
    { dayOffset: 1, title: "Essay Workshop", type: "meeting", time: "15:00" },
    { dayOffset: 2, title: "Physics Assignment Due", type: "deadline", time: "23:59" },
    { dayOffset: 3, title: "Career Counseling Session", type: "meeting", time: "11:00" },
    { dayOffset: 4, title: "TOEFL Listening Practice", type: "task", time: "10:00" },
    { dayOffset: 5, title: "Volunteer at Library", type: "event", time: "09:00" },
  ];

  for (const e of events) {
    const eventDate = new Date(startOfWeek);
    eventDate.setDate(eventDate.getDate() + e.dayOffset);
    await prisma.plannerEvent.create({
      data: { userId, title: e.title, date: eventDate, time: e.time, type: e.type },
    });
  }
  console.log(`✓ Created ${events.length} planner events`);

  // ─── University Trackers ───
  const universities = [
    { name: "Massachusetts Institute of Technology", location: "Cambridge, USA", status: "researching" },
    { name: "Stanford University", location: "Stanford, USA", status: "applied" },
    { name: "University of Cambridge", location: "Cambridge, UK", status: "researching" },
  ];

  for (const u of universities) {
    await prisma.universityTracker.create({ data: { userId, ...u } });
  }
  console.log(`✓ Created ${universities.length} university trackers`);

  // ─── Program Trackers ───
  const programs = [
    { name: "B.S. Computer Science", university: "MIT", status: "interested" },
    { name: "M.S. Artificial Intelligence", university: "Stanford", status: "researching" },
    { name: "B.A. Mathematics", university: "Cambridge", status: "interested" },
  ];

  for (const p of programs) {
    await prisma.programTracker.create({ data: { userId, ...p } });
  }
  console.log(`✓ Created ${programs.length} program trackers`);

  // ─── Scholarship Trackers ───
  const scholarships = [
    { title: "Fulbright Foreign Student Program", provider: "U.S. Department of State", amount: "$80,000", status: "saved" },
    { title: "Chevening Scholarships", provider: "UK Government", amount: "$45,000", status: "applied" },
    { title: "DAAD Scholarship", provider: "German Government", amount: "$15,000", status: "saved" },
  ];

  for (const s of scholarships) {
    await prisma.scholarshipTracker.create({ data: { userId, ...s } });
  }
  console.log(`✓ Created ${scholarships.length} scholarship trackers`);

  // ─── Resources ───
  const resources = [
    { title: "SAT Prep Guide 2025", type: "PDF", link: "https://example.com/sat-guide", tags: ["SAT", "Test Prep"] },
    { title: "How to Write a Personal Statement", type: "Video", link: "https://example.com/personal-statement", tags: ["Essay", "Application"] },
    { title: "Scholarship Database", type: "Link", link: "https://example.com/scholarships", tags: ["Scholarships", "Funding"] },
  ];

  for (const r of resources) {
    await prisma.resource.create({ data: { userId, ...r } });
  }
  console.log(`✓ Created ${resources.length} resources`);

  // ─── Roadmaps ───
  await prisma.roadmap.create({
    data: {
      userId,
      title: "Computer Science Fundamentals",
      description: "Core CS concepts every developer should know",
      color: "#8b5cf6",
      steps: {
        create: [
          { title: "Data Structures & Algorithms", description: "Learn arrays, trees, graphs, sorting", isCompleted: true, orderIndex: 0 },
          { title: "Operating Systems", description: "Processes, memory management, file systems", isCompleted: true, orderIndex: 1 },
          { title: "Database Systems", description: "SQL, normalization, indexing", isCompleted: false, orderIndex: 2 },
          { title: "Computer Networks", description: "TCP/IP, HTTP, DNS, routing", isCompleted: false, orderIndex: 3 },
          { title: "Software Engineering", description: "Design patterns, testing, CI/CD", isCompleted: false, orderIndex: 4 },
        ],
      },
    },
  });

  await prisma.roadmap.create({
    data: {
      userId,
      title: "University Application Journey",
      description: "Step-by-step guide to applying to top universities",
      color: "#10b981",
      steps: {
        create: [
          { title: "Research Universities", description: "Find programs that match your interests", isCompleted: true, orderIndex: 0 },
          { title: "Prepare for Standardized Tests", description: "SAT/ACT, TOEFL/IELTS", isCompleted: true, orderIndex: 1 },
          { title: "Write Personal Statement", description: "Draft and revise your essay", isCompleted: false, orderIndex: 2 },
          { title: "Request Recommendations", description: "Ask teachers for letters of recommendation", isCompleted: false, orderIndex: 3 },
          { title: "Submit Applications", description: "Complete and submit all applications", isCompleted: false, orderIndex: 4 },
        ],
      },
    },
  });

  console.log(`✓ Created 2 roadmaps with steps`);

  // ─── Notifications ───
  const notifications = [
    { title: "Deadline approaching", message: "SAT Registration deadline is in 3 days", type: "deadline", isRead: false },
    { title: "New scholarship available", message: "Check out the new Gates Scholarship listing", type: "system", isRead: false },
    { title: "Application update", message: "Your Stanford application status has been updated", type: "alert", isRead: true },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: { userId, ...n } });
  }
  console.log(`✓ Created ${notifications.length} notifications`);

  console.log("\n✅ Dashboard seed complete! All sections should now show data.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
