import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/chat/rooms/[id]/read — Mark all messages in room as read
export async function POST(
  _req: NextRequest,
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

  const result = await prisma.message.updateMany({
    where: {
      roomId,
      senderId: { not: session.user.id },
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ markedRead: result.count });
}
