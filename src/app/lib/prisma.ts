import { PrismaClient } from '@prisma/client'

// PrismaClient adalah singleton untuk mencegah banyak instance dalam dev mode
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 