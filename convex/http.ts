import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

// @SEE clerk action config file:///./clerk.ts
const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    // @NOTE: These actions run in a specific isolated node runtime from convex
    // see all webhooks from clerk dash: https://dashboard.clerk.com/apps/app_2d0IcTxg6ynkKPiOt0OBAyWvEeA/instances/ins_2d0IcWQ9jkBcVyRAWEABpyhrYJG/webhooks

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        // clerk webhook signatures and payload from clerk get verified with svix
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      // based on the result.type we can run different mutations to sync convex / clerk
      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.mutations.users.createUser, {
            tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.id}`,
            // name: `${result.data.first_name ?? ""} ${
            //   result.data.last_name ?? ""
            // }`,
            // image: result.data.image_url,
          });
          console.log(`user.created ${result.data.id}`);
          break;
        // case "user.updated":
        //   await ctx.runMutation(internal.users.updateUser, {
        //     tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
        //     name: `${result.data.first_name ?? ""} ${
        //       result.data.last_name ?? ""
        //     }`,
        //     image: result.data.image_url,
        //   });
        //   break;
        case "organizationMembership.created":
          await ctx.runMutation(internal.mutations.users.addOrgIdToUser, {
            tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: result.data.role === "org:admin" ? "admin" : "member",
          });

          console.log(
            `user: ${result.data.public_user_data.user_id} organizationMembership.created ${result.data.organization.id}`
          );
          break;
        case "organizationMembership.updated":
          await ctx.runMutation(
            internal.mutations.users.updateRoleInOrgForUser,
            {
              tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
              orgId: result.data.organization.id,
              role: result.data.role === "org:admin" ? "admin" : "member",
            }
          );
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
