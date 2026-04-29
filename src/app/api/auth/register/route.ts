import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nickname: z.string().min(2, "Nickname must be at least 2 characters").optional(),
  recoveryKey: z.string().min(4, "Recovery key must be at least 4 characters").optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: (parsed.error as any).errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, nickname, recoveryKey } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check nickname uniqueness if provided
    if (nickname) {
      const existingNickname = await prisma.user.findUnique({ where: { nickname } });
      if (existingNickname) {
        return NextResponse.json(
          { error: "This nickname is already taken. Please choose another." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Hash recovery key if provided
    let recoveryKeyHash: string | undefined;
    if (recoveryKey) {
      recoveryKeyHash = await bcrypt.hash(recoveryKey, 12);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        nickname: nickname || undefined,
        recoveryKeyHash: recoveryKeyHash || undefined,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
