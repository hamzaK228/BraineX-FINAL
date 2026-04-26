import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ title: z.string().min(1), provider: z.string().min(1), amount: z.string().optional(), deadline: z.string().optional(), status: z.string().optional(), link: z.string().optional() });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const scholarships = await prisma.scholarshipTracker.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(scholarships);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
  const scholarship = await prisma.scholarshipTracker.create({ data: { ...parsed.data, deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined, userId: session.user.id } });
  return NextResponse.json(scholarship, { status: 201 });
}
