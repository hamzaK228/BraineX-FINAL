import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  isCompleted: z.boolean().optional(),
  title: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, stepId } = await params;
  const roadmap = await prisma.roadmap.findFirst({ where: { id, userId: session.user.id } });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  const step = await prisma.roadmapStep.update({
    where: { id: stepId },
    data: parsed.data,
  });
  return NextResponse.json(step);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, stepId } = await params;
  const roadmap = await prisma.roadmap.findFirst({ where: { id, userId: session.user.id } });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.roadmapStep.delete({ where: { id: stepId } });
  return NextResponse.json({ success: true });
}
