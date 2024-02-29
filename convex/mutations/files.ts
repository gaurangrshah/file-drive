import {
  ConvexError,
  v,
} from 'convex/values';

import { mutation } from '../_generated/server';
import { fileTypes } from '../schema';
import { hasAccessToOrg } from '../utils';

export const createFile = mutation({
  args: {
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    fileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) {
      throw new ConvexError("You do not have access to this organization.");
    }

    await ctx.db.insert("files", {
      name: args.name,
      type: args.type,
      orgId: args.orgId,
      fileId: args.fileId,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("File not found");
    }
    const hasAccess = await hasAccessToOrg(ctx, file.orgId);
    if (!hasAccess) {
      throw new ConvexError("You do not have access to this organization.");
    }

    await ctx.db.delete(args.fileId);
  },
});
