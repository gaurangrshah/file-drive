import { defineSchema, defineTable, WithoutSystemFields } from "convex/server";
import { v } from "convex/values";

import { Doc } from "./_generated/dataModel";

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf"),
  v.literal("markdown")
);

export const fileValidator = v.object({
  name: v.string(),
  type: fileTypes,
  orgId: v.string(),
  fileId: v.id("_storage"),
  shouldDelete: v.optional(v.boolean()),
});

export const roles = v.union(v.literal("admin"), v.literal("member"));
export const userValidator = v.object({
  tokenIdentifier: v.string(),
  orgIds: v.array(
    v.object({
      orgId: v.string(),
      role: roles,
    })
  ),
});

export const favorites = v.object({
  fileId: v.id("files"),
  userId: v.id("users"),
  orgId: v.string(),
});

export default defineSchema({
  // handlers: file:///./mutations/files.ts
  // queries: file:///./queries/files.ts
  files: defineTable(fileValidator).index("by_orgId", ["orgId"]),
  // handlers: file:///./mutations/users.ts
  // queries: file:///./queries/users.ts
  users: defineTable(userValidator).index("by_tokenIdentifier", [
    "tokenIdentifier",
  ]),
  // handlers: file:///./mutations/favorites.ts
  // queries: file:///./queries/favorites.ts
  favorites: defineTable(favorites).index("by_userId_orgId_fileId", [
    // composite index
    "userId",
    "orgId",
    "fileId",
  ]),
});

export type ConvexSchema = ReturnType<typeof defineSchema>;
export type RawFiles = Doc<"files">;
export type CvxFiles = WithoutSystemFields<Doc<"files">>;

export type RawUsers = Doc<"users">;
export type CvxUsers = WithoutSystemFields<Doc<"users">>;

export type RawFavorites = Doc<"favorites">;
export type CvxFavorites = WithoutSystemFields<Doc<"favorites">>;

export const fileTypesMap = {
  "image/png": "image",
  "image/jpg": "image",
  "image/jpeg": "image",
  "image/svg+xml": "image",
  "application/pdf": "pdf",
  "text/csv": "csv",
  "text/markdown": "markdown",
} as Record<string, RawFiles["type"]>;
