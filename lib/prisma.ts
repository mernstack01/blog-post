import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isPrismaClientValid = (client: any): boolean => {
  return (
    !!client &&
    typeof client.listing?.count === 'function' &&
    typeof client.category?.count === 'function' &&
    typeof client.district?.count === 'function' &&
    typeof client.systemSetting?.findFirst === 'function'
  );
};

export const prisma =
  globalForPrisma.prisma && isPrismaClientValid(globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
