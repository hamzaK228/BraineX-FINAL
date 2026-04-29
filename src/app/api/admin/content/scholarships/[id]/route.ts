import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { logAdminActivity } from "@/lib/admin-log";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(), provider: z.string().optional(), location: z.string().optional(),
  coverage: z.string().optional(), degreeLevel: z.string().optional(), deadline: z.string().optional(),
  amount: z.number().optional(), description: z.string().optional(),
  specialFeatures: z.array(z.string()).optional(), tags: z.array(z.string()).optional(),
  applyLink: z.string().optional(), isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const item = await prisma.contentScholarship.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const item = await prisma.contentScholarship.update({ where: { id }, data: parsed.data });
  await logAdminActivity({ adminId: session.user!.id!, action: "UPDATE", target: "scholarship", targetId: id, details: `Updated scholarship: ${item.title}` });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const item = await prisma.contentScholarship.findUnique({ where: { id }, select: { title: true } });
  await prisma.contentScholarship.delete({ where: { id } });
  await logAdminActivity({ adminId: session.user!.id!, action: "DELETE", target: "scholarship", targetId: id, details: `Deleted scholarship: ${item?.title || id}` });
  return NextResponse.json({ success: true });
}
