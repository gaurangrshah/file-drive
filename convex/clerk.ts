import { v } from "convex/values";
// @NOTE: provides a way of securely signing and verifying webhooks
import { Webhook } from "svix"; // handles webhooks to/from Clerk

import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import { internalAction } from "./_generated/server";

("use node");

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

// @SEE: svix implementation - file:///./http.ts
// An internal action is used to securely handle the webhook payload
// this action can only be run from within the convex runtime
// these actions are generally used to interact with 3rd party tools
export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    const wh = new Webhook(webhookSecret);
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
});
