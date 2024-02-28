import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    // handlers: file:///./mutations/files.ts
    name: v.string(),
    orgId: v.string(),
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    // @NOTE: this info syncs via Clerk Webhooks
    // handlers: file:///./mutations/users.ts
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
