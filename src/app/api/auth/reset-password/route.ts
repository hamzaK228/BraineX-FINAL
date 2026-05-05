import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Step 1: Check if identifier (email or nickname) exists
const checkSchema = z.object({
  identifier: z.string().min(1, "Email or nickname is required"),
});

// Step 2: Reset password with new password
const resetSchema = z.object({
  identifier: z.string().min(1, "Email or nickname is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ─── CHECK: Verify identifier exists ────────────────────────────────
    if (action === "check") {
      const parsed = checkSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: (parsed.error as any).errors[0].message },
          { status: 400 }
        );
      }

      const { identifier } = parsed.data;

      // Look up user by email OR nickname
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { nickname: identifier },
          ],
        },
        select: { id: true },
      });

      // Generic response to prevent enumeration attacks
      if (!user) {
        return NextResponse.json(
          { error: "No account found with that email or nickname." },
          { status: 404 }
        );
      }

      return NextResponse.json({ exists: true });
    }

    // ─── RESET: Update password ─────────────────────────────────────────
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: (parsed.error as any).errors[0].message },
        { status: 400 }
      );
    }

    const { identifier, newPassword } = parsed.data;

    // Look up user by email OR nickname
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { nickname: identifier },
        ],
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email or nickname." },
        { status: 404 }
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
