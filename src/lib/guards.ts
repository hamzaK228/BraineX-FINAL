import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Verify that the current user has the ADMIN role.
 * Returns the session if valid, null otherwise.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") return null;
  return session;
}

/**
 * Verify that the current user is authenticated.
 * Returns the session if valid, null otherwise.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session;
}
