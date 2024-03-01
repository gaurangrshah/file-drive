import { v } from "convex/values";

import { query } from "../_generated/server";
import { hasAccessToOrg } from "../utils";
import { fileTypes } from "../schema";

export const getFiles = query({
  args: {
    orgId: v.optional(v.string()),
    query: v.optional(v.string()),
    favoritesOnly: v.optional(v.boolean()), // ! renamed to favoritesOnly
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    if (!args.orgId || typeof args.orgId !== "string") return [];

    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) return [];

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId!))
      .collect();

    if (!hasAccess.user) return files;

    // if favorites is true, we only want to return files that are favorited
    if (args.favoritesOnly) {
      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId!)
        )
        .collect();

      files = files.filter((file) => {
        return favorites.some((favorite) => favorite.fileId === file._id);
      });
      // return statement deferred to the end of the function
      // this allows to search thru files that are favorited
    }

    // if deletedOnly is true, we only want to return files that are deleted
    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    // if a query is provided this is a search intent
    const query = args.query || undefined;
    if (query) {
      // NOTE: This is a simple search, we can make this more robust later
      files = files.filter((file) => {
        return file.name.toLowerCase().includes(query.toLowerCase());
      });
    }
    if (args.type) {
      files = files.filter((file) => file.type === args.type);
    }

    return files?.length ? files : [];
  },
});
