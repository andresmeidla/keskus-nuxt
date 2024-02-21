import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function run() {
  await prisma.$connect();
  await prisma.user.create({
    data: {
      firstname: 'Andy',
      lastname: 'Murray',
      username: 'andy',
      password: await hash('murray', 10),
      email: 'andy@murray.com',
      role: 'admin',
    },
  });
  // eslint-disable-next-line no-console
  console.log('Seeding done.');
}

run();
