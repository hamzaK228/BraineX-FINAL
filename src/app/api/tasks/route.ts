import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  urgent: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = taskSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  const task = await prisma.task.create({
    data: { 
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status || "todo",
      priority: parsed.data.priority || "General",
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      urgent: parsed.data.urgent || false,
      userId: session.user.id 
    },
  });
  return NextResponse.json(task, { status: 201 });
}
