
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminUsers = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true, name: true }
  });
  console.log("Admin Users:", JSON.stringify(adminUsers, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
