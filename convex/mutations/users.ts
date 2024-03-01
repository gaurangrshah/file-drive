import { ConvexError, v } from "convex/values";

import { internalMutation } from "../_generated/server";
import { getUser } from "../queries/users";
import { roles } from "../schema";
import { hasAccessToOrg } from "../utils";

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
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },

  async handler(ctx, args) {
    try {
      const user = await getUser(ctx, args.tokenIdentifier);
      if (!user) throw new ConvexError("Expected user to be defined.");

      await ctx.db.patch(user._id, {
        // tokenIdentifier: args.tokenIdentifier,
        orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
      });
    } catch (error) {
      console.log("addOrgIdToUser, error", error);
    }
  },
});

// everytime a user is removed from an organization this mutation will fire via a Webhook
export const updateRoleInOrgForUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    try {
      if (!args.tokenIdentifier) {
        throw new ConvexError("expected a tokenIdentifier");
      }

      const user = await getUser(ctx, args.tokenIdentifier);
      const org = user.orgIds.find((org) => org.orgId === args.orgId);

      if (!org) {
        throw new ConvexError(
          "expected an org on the user but was not found when updating"
        );
      }

      org.role = args.role;

      await ctx.db.patch(user._id, {
        orgIds: user.orgIds,
      });
    } catch (error) {
      console.log("updateRoleInOrgForUser, error", error);
    }
  },
});
