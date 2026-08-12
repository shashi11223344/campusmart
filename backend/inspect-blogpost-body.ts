import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function stringify(value: unknown) {
  return JSON.stringify(value, (_key, val) => typeof val === 'bigint' ? val.toString() : val, 2);
}

async function main() {
  await prisma.$connect();
  const rows = await prisma.$queryRawUnsafe(`SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_TYPE, IS_NULLABLE FROM information_schema.COLUMNS WHERE table_schema = DATABASE() AND table_name = 'blogpost';`);
  console.log(stringify(rows));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
