import { ConvexError, v } from "convex/values";

import { internalMutation } from "../_generated/server";

// @NOTE: Internal mutations will only be run from within the convex runtime
// we're using them here to sync our database with clerks users via webhooks
export const createUser = internalMutation({
  // @SEE: ,,/clerk.ts | ../http.ts
  args: {
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    });
  },
});

// everytime a user is added to an organization this mutation will fire via a Webhook
// this will add the orgId of the new org to the users orgIds array
export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();

    if (!user) throw new ConvexError("Expected user to be defined.");

    await ctx.db.patch(user._id, {
      // tokenIdentifier: args.tokenIdentifier,
      orgIds: [...user.orgIds, args.orgId],
    });
  },
});
