import { ConvexError, v } from "convex/values";

import { internalMutation, mutation } from "../_generated/server";
import { fileTypes, favorites } from "../schema";
import { canActOnFile, hasAccessToFile, hasAccessToOrg } from "../utils";

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
      userId: hasAccess.user._id,
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
    const access = await canActOnFile(ctx, args.fileId);

    // ! Implemented removal of favorites before file deletion.
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", access?.user._id!)
          .eq("orgId", access?.file.orgId!)
          .eq("fileId", args.fileId)
      )
      .collect();

    for (const favorite of favorites) {
      console.log("deleting", favorite._id);
      await ctx.db.delete(favorite._id);
    }

    // mark files for deletion instead of deleting them directly
    // allows for soft delete and we can run a convex cron job to actually delete the files
    // the cron job will run periodically and delete files that are marked for deletion
    await ctx.db.patch(args.fileId, { shouldDelete: true });
    // await ctx.db.delete(args.fileId);
  },
});

export const restoreFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await canActOnFile(ctx, args.fileId);
    if (!access) {
      throw new ConvexError("You do not have sufficient privileges.");
    }

    await ctx.db.patch(args.fileId, { shouldDelete: false });
    // await ctx.db.delete(args.fileId);
  },
});

// this is run by a cron job from file:///../cron.ts
export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {
    console.log("deleting files cron running...");
    const files = await ctx.db
      .query("files")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

    console.log("files to delete", files?.length);
    if (!files?.length) {
      return;
    }
    await Promise.all(
      files.map(async (file) => {
        console.log("deleting file", file._id);
        await ctx.storage.delete(file.fileId);
        return await ctx.db.delete(file._id);
      })
    );
  },
});
