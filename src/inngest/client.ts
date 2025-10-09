import { Inngest } from "inngest";

const isDev = process.env.NODE_ENV === "development";

export const inngest = new Inngest({
  id: "my-app",
  isDev,
  baseUrl: isDev ? process.env.INNGEST_BASE_URL : undefined,
});
