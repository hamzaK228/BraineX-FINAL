import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { logAdminActivity } from "@/lib/admin-log";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1), 
  category: z.string().min(1), 
  icon: z.string().optional(),
  description: z.string().optional(), 
  salary: z.union([z.string(), z.number()]).transform(v => String(v)).optional(),
  growth: z.union([z.string(), z.number()]).transform(v => String(v)).optional(),
  demand: z.union([z.string(), z.number()]).transform(v => String(v)).optional(),
  topUnis: z.union([z.string(), z.number()]).transform(v => String(v)).optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(), 
  isPublished: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const search = searchParams.get("search") || "";
  const where: any = {};
  if (search) { where.title = { contains: search, mode: "insensitive" }; }
  const [items, total] = await Promise.all([
    prisma.contentField.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.contentField.count({ where }),
  ]);
  return NextResponse.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const item = await prisma.contentField.create({ data: parsed.data });
  await logAdminActivity({ adminId: session.user!.id!, action: "CREATE", target: "field", targetId: item.id, details: `Created field: ${item.title}` });
  return NextResponse.json(item, { status: 201 });
}
