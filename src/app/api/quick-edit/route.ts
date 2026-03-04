import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { groq } from "@ai-sdk/groq";
import { firecrawl } from "@/lib/firecrawl";
import { z } from "zod";
import { QUICK_EDIT_PROMPT } from "@/constants";
import { generateText, Output } from "ai";

const quickEditSchema = z.object({
  editedCode: z
    .string()
    .describe(
      "The edited version of the selected code based on the instruction."
    ),
});

const URL_REGEX = /https?:\/\/[^\s]+/g;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const { selectedCode, fullCode, instruction, fileName } = body;

    if (!selectedCode) {
      return NextResponse.json(
        { error: "Selected code is required" },
        { status: 400 }
      );
    }

    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 }
      );
    }

    const urls: string[] = instruction.match(URL_REGEX) || [];

    let documentation = "";

    if (urls.length > 0) {
      const scrappedResults = await Promise.all(
        urls.map(async (url) => {
          try {
            const result = await firecrawl.scrape(url, {
              formats: ["markdown"],
            });

            if (result.markdown) {
              return `<doc url="${url}">${result.markdown}</doc>`;
            }

            return null;
          } catch (error) {
            console.error(`Error scraping URL: ${url}`, error);
            return null;
          }
        })
      );

      const validResults = scrappedResults.filter(Boolean);

      if (validResults.length > 0) {
        documentation = `<documentation>\n${validResults.join("\n\n")}\n</documentation>`;
      }
    }

    const prompt = QUICK_EDIT_PROMPT.replace("{fileName}", fileName)
      .replace("{selectedCode}", selectedCode)
      .replace("{fullCode}", fullCode)
      .replace("{instruction}", instruction)
      .replace("{documentation}", documentation);

    const { output } = await generateText({
      model: groq("moonshotai/kimi-k2-instruct-0905"),
      output: Output.object({ schema: quickEditSchema }),
      prompt,
    });

    return NextResponse.json({ editedCode: output.editedCode });
  } catch (error) {
    console.error("Error generating quick edit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
