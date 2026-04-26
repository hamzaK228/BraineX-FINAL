import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(5000),
  type: z.string().optional(),
});

// GET /api/chat/rooms/[id]/messages — Fetch message history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: roomId } = await params;

  // Verify user is a participant
  const participant = await prisma.chatParticipant.findUnique({
    where: { userId_roomId: { userId: session.user.id, roomId } },
  });
  if (!participant)
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });

  // Get cursor for pagination
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      roomId,
      senderId: { not: session.user.id },
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({
    messages: messages.reverse(), // Chronological order
    nextCursor: messages.length === limit ? messages[0]?.id : null,
  });
}

// POST /api/chat/rooms/[id]/messages — Send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: roomId } = await params;

  // Verify user is a participant
  const participant = await prisma.chatParticipant.findUnique({
    where: { userId_roomId: { userId: session.user.id, roomId } },
  });
  if (!participant)
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });

  const body = await req.json();
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      content: parsed.data.content,
      type: parsed.data.type || "text",
      senderId: session.user.id,
      roomId,
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  // Update room's updatedAt to push it to top of list
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message, { status: 201 });
}
