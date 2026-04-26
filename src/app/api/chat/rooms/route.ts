import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createRoomSchema = z.object({
  participantId: z.string().min(1),
  name: z.string().optional(),
});

// GET /api/chat/rooms — List user's chat rooms
export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rooms = await prisma.chatRoom.findMany({
    where: {
      participants: {
        some: { userId: session.user.id },
      },
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true, senderId: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Format response with unread counts
  const formatted = await Promise.all(
    rooms.map(async (room) => {
      const unread = await prisma.message.count({
        where: {
          roomId: room.id,
          isRead: false,
          senderId: { not: session.user!.id },
        },
      });

      return {
        id: room.id,
        name: room.name,
        participants: room.participants.map((p) => ({
          ...p.user,
          role: p.role,
        })),
        lastMessage: room.messages[0] || null,
        unreadCount: unread,
        updatedAt: room.updatedAt,
      };
    })
  );

  return NextResponse.json(formatted);
}

// POST /api/chat/rooms — Create a new chat room
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createRoomSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  const { participantId, name } = parsed.data;

  // Check if a room already exists between these two users
  const existingRoom = await prisma.chatRoom.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: session.user.id } } },
        { participants: { some: { userId: participantId } } },
      ],
    },
  });

  if (existingRoom) {
    return NextResponse.json({ id: existingRoom.id, existing: true });
  }

  // Check target user exists
  const targetUser = await prisma.user.findUnique({ where: { id: participantId } });
  if (!targetUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const room = await prisma.chatRoom.create({
    data: {
      name: name || null,
      participants: {
        create: [
          { userId: session.user.id, role: "member" },
          { userId: participantId, role: targetUser.role === "MENTOR" ? "mentor" : "member" },
        ],
      },
    },
  });

  return NextResponse.json({ id: room.id, existing: false }, { status: 201 });
}
