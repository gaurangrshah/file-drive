/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.10.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clerk from "../clerk.js";
import type * as http from "../http.js";
import type * as mutations_favorites from "../mutations/favorites.js";
import type * as mutations_files from "../mutations/files.js";
import type * as mutations_users from "../mutations/users.js";
import type * as queries_favorites from "../queries/favorites.js";
import type * as queries_files from "../queries/files.js";
import type * as queries_users from "../queries/users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clerk: typeof clerk;
  http: typeof http;
  "mutations/favorites": typeof mutations_favorites;
  "mutations/files": typeof mutations_files;
  "mutations/users": typeof mutations_users;
  "queries/favorites": typeof queries_favorites;
  "queries/files": typeof queries_files;
  "queries/users": typeof queries_users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
