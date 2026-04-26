import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saveSchema = z.object({
  itemId: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  source: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.savedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  // Check for duplicate
  const existing = await prisma.savedItem.findUnique({
    where: {
      userId_itemId_type: {
        userId: session.user.id,
        itemId: parsed.data.itemId,
        type: parsed.data.type,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Item already saved" }, { status: 409 });
  }

  const item = await prisma.savedItem.create({
    data: { ...parsed.data, userId: session.user.id },
  });
  return NextResponse.json(item, { status: 201 });
}
