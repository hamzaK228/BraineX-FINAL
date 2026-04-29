import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetSchema = z.object({
  nickname: z.string().min(1, "Nickname is required"),
  recoveryKey: z.string().min(1, "Recovery key is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: (parsed.error as any).errors[0].message },
        { status: 400 }
      );
    }

    const { nickname, recoveryKey, newPassword } = parsed.data;

    // Look up user by nickname (don't reveal whether nickname exists)
    const user = await prisma.user.findUnique({
      where: { nickname },
      select: { id: true, recoveryKeyHash: true },
    });

    if (!user || !user.recoveryKeyHash) {
      // Generic error message to prevent nickname enumeration
      return NextResponse.json(
        { error: "Invalid nickname or recovery key." },
        { status: 400 }
      );
    }

    // Verify recovery key
    const isKeyValid = await bcrypt.compare(recoveryKey, user.recoveryKeyHash);
    if (!isKeyValid) {
      return NextResponse.json(
        { error: "Invalid nickname or recovery key." },
        { status: 400 }
      );
    }

    // Hash new password and update
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
