import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { logAdminActivity } from "@/lib/admin-log";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  country: z.string().min(1),
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

// GET /api/admin/content/universities — List all content universities
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 2000);
  const search = searchParams.get("search") || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.contentUniversity.findMany({
      where,
      orderBy: { ranking: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contentUniversity.count({ where }),
  ]);

  return NextResponse.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

// POST /api/admin/content/universities — Create a university
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const item = await prisma.contentUniversity.create({ data: parsed.data });

  await logAdminActivity({
    adminId: session.user!.id!,
    action: "CREATE",
    target: "university",
    targetId: item.id,
    details: `Created university: ${item.name}`,
  });

  return NextResponse.json(item, { status: 201 });
}
