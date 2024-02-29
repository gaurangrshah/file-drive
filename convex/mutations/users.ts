import { ConvexError, v } from "convex/values";

import { internalMutation } from "../_generated/server";
import { getUser } from "../queries/users";

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
    const user = await getUser(ctx, args.tokenIdentifier);
    if (!user) throw new ConvexError("Expected user to be defined.");

    await ctx.db.patch(user._id, {
      // tokenIdentifier: args.tokenIdentifier,
      orgIds: [...user.orgIds, args.orgId],
    });
  },
});
