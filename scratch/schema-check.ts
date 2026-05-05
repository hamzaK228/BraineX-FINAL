
import { prisma } from '../src/lib/prisma';
async function test() {
  try {
    const res = await (prisma as any).$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ContentScholarship'");
    console.log("SCHEMA:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("RAW_ERROR:", e.message);
  }
}
test();
