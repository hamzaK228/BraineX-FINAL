require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@brainex.com';
  const password = 'admin123';
  const name = 'System Admin';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists. Promoting to ADMIN...');
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log('User promoted successfully.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'ADMIN',
      tier: 'Pro'
    }
  });

  console.log('Admin account created successfully:');
  console.log('Email:', email);
  console.log('Password:', password);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
