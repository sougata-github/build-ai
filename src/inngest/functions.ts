import { createAgent, gemini } from "@inngest/agent-kit";

import { inngest } from "./client";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system: `You are an expert Next.js developer. You write clean, readable and maintainable code. You write simple Next.js and React snippets. Be precise. Only provide code snippet.`,
      model: gemini({ model: "gemini-2.5-flash" }),
    });

    const { output } = await codeAgent.run(
      `Generate code for: : ${event.data.input}`
    );

    console.log(output);

    return { message: output[0].type === "text" && output[0].content };
  }
);
