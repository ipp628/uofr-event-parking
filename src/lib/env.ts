import { z } from "zod";

// Validate environment variables on first use (not at import), so builds that
// don't touch the database never need them, but a missing value still fails loudly at runtime.
const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

let cached: z.infer<typeof schema> | undefined;

export function getEnv() {
  cached ??= schema.parse(process.env);
  return cached;
}
