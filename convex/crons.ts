import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete any files marked for deletion",
  { minutes: 3 },
  internal.mutations.files.deleteAllFiles
);

export default crons;
