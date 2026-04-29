import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ title: z.string().min(1), date: z.string(), time: z.string().optional(), type: z.string().optional() });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = await prisma.plannerEvent.findMany({ where: { userId: session.user.id }, orderBy: { date: "asc" } });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
  const event = await prisma.plannerEvent.create({ data: { ...parsed.data, date: new Date(parsed.data.date), userId: session.user.id } });
  return NextResponse.json(event, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing event id" }, { status: 400 });

  // Ensure the event belongs to the user
  const event = await prisma.plannerEvent.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  await prisma.plannerEvent.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
