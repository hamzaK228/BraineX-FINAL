import { prisma } from "@/lib/prisma";

/**
 * Log an admin activity to the AdminActivity table.
 */
export async function logAdminActivity(data: {
  adminId: string;
  adminName?: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "BLOCK" | "UNBLOCK";
  target: string;
  targetId?: string;
  details?: string;
}) {
  try {
    await prisma.adminActivity.create({ data });
  } catch (e) {
    console.error("[ADMIN_ACTIVITY_LOG]", e);
  }
}
