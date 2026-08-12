import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function stringify(value: unknown) {
  return JSON.stringify(value, (_key, val) => typeof val === 'bigint' ? val.toString() : val, 2);
}

async function main() {
  await prisma.$connect();
  console.log('CONNECTED');
  const processlist = await prisma.$queryRawUnsafe('SHOW PROCESSLIST');
  console.log('SHOW PROCESSLIST', stringify(processlist));
  const innodbTrx = await prisma.$queryRawUnsafe('SELECT * FROM information_schema.INNODB_TRX');
  console.log('INNODB_TRX', stringify(innodbTrx));
  const innodbWaits = await prisma.$queryRawUnsafe('SELECT * FROM information_schema.INNODB_LOCK_WAITS');
  console.log('INNODB_LOCK_WAITS', stringify(innodbWaits));
  const locks = await prisma.$queryRawUnsafe('SELECT * FROM information_schema.INNODB_LOCKS LIMIT 20');
  console.log('INNODB_LOCKS', stringify(locks));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
