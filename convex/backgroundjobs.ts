import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";


export const exampleMutation = mutation({
  args: { input: v.string() },
  handler: async (ctx, { input }) => {
    await ctx.scheduler.runAfter(0, internal.inngest.invoke, {
      input,
    });
  },
});
