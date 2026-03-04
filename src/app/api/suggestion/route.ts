import { generateText } from "ai";
import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { SUGGESTION_PROMPT } from "@/constants";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      fileName,
      previousLines,
      currentLine,
      textBeforeCursor,
      textAfterCursor,
      nextLines,
      code,
      lineNumber,
    } = body;

    if (!code)
      return NextResponse.json({ error: "Code is required" }, { status: 400 });

    const prompt = SUGGESTION_PROMPT.replace("{fileName}", fileName)
      .replace("{previousLines}", previousLines || "")
      .replace("{currentLine}", currentLine)
      .replace("{textBeforeCursor}", textBeforeCursor)
      .replace("{textAfterCursor}", textAfterCursor)
      .replace("{nextLines}", nextLines || "")
      .replace("{code}", code)
      .replace("{lineNumber}", lineNumber.toString());

    const { text } = await generateText({
      model: groq("moonshotai/kimi-k2-instruct-0905"),
      prompt,
    });

    const suggestion = text
      .trim()
      .replace(/^```[\w]*\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error generating suggestion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
