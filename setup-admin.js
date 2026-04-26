const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@brainex.com' },
    update: { role: 'ADMIN', passwordHash: hash },
    create: { email: 'admin@brainex.com', name: 'Admin', role: 'ADMIN', passwordHash: hash }
  });
  console.log('Admin user ready!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
