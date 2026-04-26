import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const goalSchema = z.object({
  title: z.string().min(1),
  progress: z.number().min(0).max(100).optional(),
  targetDate: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = goalSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  const goal = await prisma.goal.create({
    data: {
      ...parsed.data,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : undefined,
      userId: session.user.id,
    },
  });
  return NextResponse.json(goal, { status: 201 });
}
