/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? [/* 'query', */ 'error', 'warn'] : ['error'],
  });
  if (process.env.LOG_SQL) {
    global.prisma.$on('query' as 'beforeExit', (e: any) => {
      console.log(`Query: ${e.query}`);
      console.log(`Params: ${e.params}`);
      console.log(`Duration: ${e.duration}ms`);
    });
  }
}

export default defineNitroPlugin(() => {});
