import { Inngest } from "inngest";
import { sentryMiddleware } from "@inngest/middleware-sentry";

// Inngest client to send and receive events
export const inngest = new Inngest({
  id: "build-ai",
  //sentry intercepts all the background jobs for error tracking
  middleware: [sentryMiddleware()],
});
