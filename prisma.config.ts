import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI (migrate, studio) should use the DIRECT (non-pooled) connection string.
// `prisma generate` needs no database, so a missing URL must not break installs/builds
// (e.g. the first Vercel build before environment variables exist).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "" },
});
