import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  language: z.string().optional(),
  timeZone: z.string().optional(),
  theme: z.string().optional(),
  emailNotifs: z.boolean().optional(),
  pushNotifs: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, language: true, timeZone: true, theme: true, emailNotifs: true, pushNotifs: true, weeklyDigest: true, twoFactorEnabled: true, tier: true },
  });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { name: true, email: true, language: true, timeZone: true, theme: true, emailNotifs: true, pushNotifs: true, weeklyDigest: true, twoFactorEnabled: true },
  });
  return NextResponse.json(user);
}
