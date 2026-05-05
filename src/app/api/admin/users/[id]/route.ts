import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"]).optional(),
  tier: z.string().optional(),
  status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
});

// PATCH /api/admin/users/[id] — Update user role/tier/status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adminId = session.user!.id!;
  const adminName = session.user!.name || "Admin";
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

  // Prevent demoting yourself
  if (id === adminId && parsed.data.role && parsed.data.role !== "ADMIN")
    return NextResponse.json({ error: "Cannot change your own admin role" }, { status: 400 });

  // Prevent blocking yourself
  if (id === adminId && parsed.data.status === "BLOCKED")
    return NextResponse.json({ error: "Cannot block yourself" }, { status: 400 });

  const user = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: { id: true, name: true, email: true, role: true, tier: true, status: true },
  });

  // Log activity
  if (parsed.data.status) {
    await prisma.adminActivity.create({
      data: {
        adminId,
        adminName,
        action: parsed.data.status === "BLOCKED" ? "BLOCK" : "UNBLOCK",
        target: "user",
        targetId: id,
        details: `${parsed.data.status === "BLOCKED" ? "Blocked" : "Unblocked"} user ${user.email}`,
      },
    });
  }

  if (parsed.data.role) {
    await prisma.adminActivity.create({
      data: {
        adminId,
        adminName,
        action: "UPDATE",
        target: "user",
        targetId: id,
        details: `Changed role of ${user.email} to ${parsed.data.role}`,
      },
    });
  }

  return NextResponse.json(user);
}

// DELETE /api/admin/users/[id] — Delete user
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adminId = session.user!.id!;
  const adminName = session.user!.name || "Admin";
  const { id } = await params;

  if (id === adminId)
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id }, select: { email: true } });

  await prisma.user.delete({ where: { id } });

  // Log activity
  await prisma.adminActivity.create({
    data: {
      adminId,
      adminName,
      action: "DELETE",
      target: "user",
      targetId: id,
      details: `Deleted user ${user?.email || id}`,
    },
  });

  return NextResponse.json({ success: true });
}
