import { TIME_ZONE } from "@/lib/constants";

const PREFIX = "UPR";

/** Year of a date as seen in Saskatchewan (no daylight saving, UTC-6). */
function reginaYear(date: Date): number {
  return Number(new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric" }).format(date));
}

/** Public reference number, e.g. UPR-2026-000123. `seq` comes from the DB autoincrement column. */
export function formatReference(createdAt: Date, seq: number): string {
  return `${PREFIX}-${reginaYear(createdAt)}-${String(seq).padStart(6, "0")}`;
}

/** Parse user input like " upr-2026-000123 ". Returns null when it is not a valid reference. */
export function parseReference(input: string): { year: number; seq: number } | null {
  const match = /^UPR-(\d{4})-(\d{6})$/.exec(input.trim().toUpperCase());
  if (!match) return null;
  const seq = Number(match[2]);
  if (seq < 1) return null;
  return { year: Number(match[1]), seq };
}
