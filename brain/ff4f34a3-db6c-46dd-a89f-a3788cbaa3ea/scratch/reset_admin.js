
require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not set");
    return;
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = "admin@brainex.com";
  const newPassword = "admin123456";

  try {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: "ADMIN" },
      create: { 
        email, 
        name: "Administrator", 
        passwordHash, 
        role: "ADMIN" 
      }
    });

    console.log(`SUCCESS: Admin password for ${email} has been reset to: ${newPassword}`);
  } catch (err) {
    console.error("Reset failed:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
