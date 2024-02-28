import { z, ZodError } from "zod";

import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";

// @TOOD: Add schema validation on build step
// @SEE: https://env.t3.gg/docs/nextjs#validate-schema-on-build-(recommended)

export const env = createEnv({
  isServer: typeof window === "undefined",
  server: {
    CONVEX_DEPLOYMENT: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_HOSTNAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  // OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client"
    );
  },
  extends: [vercel],
});
