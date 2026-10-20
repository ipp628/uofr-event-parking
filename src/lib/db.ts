import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getEnv } from "@/lib/env";

// Reuse one client across hot reloads in development to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Lazily creates the Prisma client; call this inside request handlers, not at module top level. */
export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: getEnv().DATABASE_URL,
      // Serverless-friendly: few connections per instance, and enough time for a sleeping
      // Neon database to wake up on the first request.
      max: 5,
      connectionTimeoutMillis: 15_000,
    });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
