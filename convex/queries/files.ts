import { v } from 'convex/values';

import { query } from '../_generated/server';
import { hasAccessToOrg } from '../utils';

export const getFiles = query({
  args: {
    orgId: v.string() || "skip",
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) return [];

    return ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});
