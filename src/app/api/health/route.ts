import { connection, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Liveness + database connectivity check. Returns no internal details on failure.
export async function GET() {
  await connection(); // run on every request, never during the build
  try {
    await getDb().$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ status: "database_unavailable" }, { status: 503 });
  }
}

