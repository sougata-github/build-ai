"use node";

import { v } from "convex/values";

import { internalAction } from "./_generated/server";
import { inngest } from "@/inngest/client";

export const invoke = internalAction({
  args: {
    input: v.string(),
  },
  handler: async (_ctx, { input }) => {
    try {
      await inngest.send({
        name: "test/hello.world",
        data: {
          input,
        },
      });
    } catch (error) {
      console.error("Inngest function failed to run", error);
      return { success: false, error: (error as Error).message };
    }
  },
});
