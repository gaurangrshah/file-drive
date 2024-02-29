import { ConvexError, v } from "convex/values";

import { mutation } from "../_generated/server";
import { hasAccessToOrg } from "../queries/users";

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) {
      throw new ConvexError("You do not have access to this organization.");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
    });
  },
});
