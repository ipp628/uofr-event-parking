import { connection, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Liveness + database connectivity check.
// Reports only a coarse reason (never URLs, hosts or credentials); full details go to server logs.
export async function GET() {
  await connection(); // run on every request, never during the build

  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ status: "database_unavailable", reason: "missing_database_url" }, { status: 503 });
  }
  if (!/^postgres(ql)?:\/\//.test(url)) {
    // e.g. prisma+postgres:// (Accelerate URL) cannot be used with the pg driver adapter
    return NextResponse.json({ status: "database_unavailable", reason: "unsupported_url_format" }, { status: 503 });
  }

  try {
    await getDb().$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    // Server-side only (Vercel Logs): enough detail to diagnose, never sent to the visitor.
    const e = error as { name?: string; code?: string; message?: string; cause?: { code?: string; message?: string }; meta?: unknown };
    console.error("Health check failed:", {
      name: e?.name,
      code: e?.code,
      message: e?.message,
      causeCode: e?.cause?.code,
      causeMessage: e?.cause?.message,
      meta: e?.meta,
    });
    return NextResponse.json({ status: "database_unavailable", reason: "connection_failed" }, { status: 503 });
  }
}
