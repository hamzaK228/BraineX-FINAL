import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(), category: z.string().optional(), icon: z.string().optional(),
  description: z.string().optional(), salary: z.string().optional(), growth: z.string().optional(),
  demand: z.string().optional(), topUnis: z.string().optional(), tags: z.array(z.string()).optional(),
  image: z.string().optional(), isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const item = await prisma.contentField.findUnique({ where: { id } });
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
  const item = await prisma.contentField.update({ where: { id }, data: parsed.data });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.contentField.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
