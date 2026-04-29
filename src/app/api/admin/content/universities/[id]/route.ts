import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { logAdminActivity } from "@/lib/admin-log";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  ranking: z.number().optional(),
  type: z.string().optional(),
  tuition: z.number().optional(),
  acceptance: z.number().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const item = await prisma.contentUniversity.findUnique({ where: { id } });
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
  const item = await prisma.contentUniversity.update({ where: { id }, data: parsed.data });

  await logAdminActivity({
    adminId: session.user!.id!,
    action: "UPDATE",
    target: "university",
    targetId: id,
    details: `Updated university: ${item.name}`,
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const item = await prisma.contentUniversity.findUnique({ where: { id }, select: { name: true } });
  await prisma.contentUniversity.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user!.id!,
    action: "DELETE",
    target: "university",
    targetId: id,
    details: `Deleted university: ${item?.name || id}`,
  });

  return NextResponse.json({ success: true });
}
