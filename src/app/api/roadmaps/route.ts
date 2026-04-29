import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ 
  title: z.string().min(1), 
  description: z.string().optional(),
  color: z.string().optional(),
  steps: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    orderIndex: z.number().optional(),
    status: z.string().optional()
  })).optional()
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId: session.user.id },
    include: { steps: { orderBy: { orderIndex: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(roadmaps);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    
    const { steps, ...rest } = parsed.data;
    
    const roadmap = await prisma.roadmap.create({ 
      data: { 
        ...rest, 
        userId: session.user.id,
        steps: steps ? {
          create: steps.map((s, i) => ({
            title: s.title,
            description: s.description,
            orderIndex: s.orderIndex ?? i,
            isCompleted: s.status === 'completed'
          }))
        } : undefined
      }, 
      include: { steps: true } 
    });
    
    return NextResponse.json(roadmap, { status: 201 });
  } catch (error: any) {
    console.error("Roadmap creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create roadmap" }, { status: 500 });
  }
}
