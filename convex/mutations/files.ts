import { ConvexError, v } from "convex/values";

import { mutation } from "../_generated/server";

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
    });
  },
});
