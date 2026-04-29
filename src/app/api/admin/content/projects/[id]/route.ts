import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { logAdminActivity } from "@/lib/admin-log";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(), creator: z.string().optional(), difficulty: z.string().optional(),
  category: z.string().optional(), status: z.string().optional(), duration: z.string().optional(),
  description: z.string().optional(), tags: z.array(z.string()).optional(),
  image: z.string().optional(), isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const item = await prisma.contentProject.findUnique({ where: { id } });
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
  const item = await prisma.contentProject.update({ where: { id }, data: parsed.data });
  await logAdminActivity({ adminId: session.user!.id!, action: "UPDATE", target: "project", targetId: id, details: `Updated project: ${item.title}` });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const item = await prisma.contentProject.findUnique({ where: { id }, select: { title: true } });
  await prisma.contentProject.delete({ where: { id } });
  await logAdminActivity({ adminId: session.user!.id!, action: "DELETE", target: "project", targetId: id, details: `Deleted project: ${item?.title || id}` });
  return NextResponse.json({ success: true });
}
