import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deadline = await prisma.deadline.findFirst({ where: { id, userId: session.user.id } });
  if (!deadline) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.deadline.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
