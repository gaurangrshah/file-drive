import { v } from "convex/values";

import { query } from "../_generated/server";
import { hasAccessToOrg } from "../utils";

export const getFiles = query({
  args: {
    orgId: v.string() || "skip",
    query: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) return [];

    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query || undefined;

    if (!query || query === "") {
      return files;
    } else {
      return files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
});
