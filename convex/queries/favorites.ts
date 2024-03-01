import { v } from "convex/values";
import { query } from "../_generated/server";
import { hasAccessToOrg } from "../utils";

export const getAllFavorites = query({
  args: { orgId: v.optional(v.string()) },
  async handler(ctx, args) {
    if (!args.orgId) return [];
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let orgId = args.orgId;
    if (typeof orgId !== "string") {
      orgId = String(orgId);
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", hasAccess.user._id).eq("orgId", orgId)
      )
      .collect();

    return favorites;
  },
});
