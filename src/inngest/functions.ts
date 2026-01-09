import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";

export const generate = inngest.createFunction(
  { id: "generate" },
  { event: "demo/generate" },
  async ({ step }) => {
    await step.run("generate-text", async () => {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: "What is the capital of France?",
      });

      return text;
    });
  }
);
