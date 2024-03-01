import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.orgIds.some((org) => org.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

export async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(ctx, file.orgId);

  if (!hasAccess) {
    return null;
  }

  return { user: hasAccess.user, file };
}

export async function canActOnFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {
  const access = await hasAccessToFile(ctx, fileId);

  if (!access) {
    return null;
  }

  const ownsFile = access?.user._id === access?.file.userId;

  // user can perform protected file actions if they own the file or are an admin of the org
  const canOperate =
    ownsFile ||
    access?.user.orgIds.find((org) => org.orgId === access.file.orgId)?.role ===
      "admin";

  if (!canOperate) {
    return null;
  }

  return access;
}
