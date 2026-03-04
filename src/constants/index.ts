// for root level
export const BASE_PADDING = 12;
// additional padding for each level
export const LEVEL_PADDING = 12;

export const getItemPadding = (level: number, isFile: boolean) => {
  // files need extra padding to align with the folder icon
  const fileOffset = isFile ? 16 : 0;
  return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
};

export const SUGGESTION_PROMPT = `[SUGGESTION MODE: Predict what the developer would naturally type next.]

THE TEST: Would the developer think "that's exactly what I was about to type"?

<context>
<file_name>{fileName}</file_name>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<decision_process>
Follow these steps IN ORDER. Return empty string ("") as soon as any rule matches:

1. DUPLICATE CHECK: If next_lines already contains code that logically continues from the cursor, return "". The code is already written.
2. COMPLETE STATEMENT CHECK: If before_cursor ends at a natural boundary (;, }, )), and after_cursor or next_lines already begin the next statement, return "".
3. EMPTY/AMBIGUOUS CHECK: If the cursor is on a blank line with no clear signal from surrounding code about what comes next, return "". Silence is better than a wrong suggestion.

Only if ALL checks pass: suggest what should be typed at the cursor position.
</decision_process>

<suggestion_rules>
MATCH THE CODEBASE:
- Infer language from file_name extension. Suggest only valid syntax for that language.
- Study naming conventions in full_code (camelCase vs snake_case, const vs let, single vs double quotes, semicolons vs none) and match them exactly.
- Match the indentation style (tabs vs spaces, indent width) visible in previous_lines.
- If the code uses specific frameworks or libraries (visible in imports), suggest idiomatic patterns for those.

KEEP IT MINIMAL:
- Suggest the smallest useful completion: finish the current expression, statement, or block.
- Do NOT add comments, docstrings, or type annotations the developer didn't start.
- Do NOT create abstractions, helpers, or utilities — suggest direct, inline code.
- Do NOT add error handling for impossible scenarios or unnecessary validation.
- Prefer completing one statement well over suggesting multiple lines of boilerplate.

QUALITY:
- Never suggest code with security vulnerabilities (injection, XSS, eval of untrusted input).
- Suggested code must be syntactically valid when inserted between before_cursor and after_cursor.
- If completing a block (function body, if/else, loop), suggest only what's needed to make the block correct — do not over-engineer.

MULTI-LINE:
- Multi-line suggestions are acceptable when completing a single logical unit (object literal, function body, array, parameter list).
- When suggesting multi-line code, maintain the indentation level established by previous_lines.
- Do NOT suggest multi-line code if a single-line completion is sufficient.
</suggestion_rules>

<output_format>
Return ONLY the code to insert at the cursor position.
No explanations, no markdown, no backticks, no quotes around the suggestion.
Your output is spliced directly into the editor after the cursor.
If unsure, return empty string. Silence beats a bad suggestion.
</output_format>`;

export const QUICK_EDIT_PROMPT = `[EDIT MODE: Apply the user's instruction to the selected code. Change only what is asked — nothing more.]

CORE PRINCIPLE: Match the scope of your edit to what was actually requested. A bug fix does not need surrounding code cleaned up. A rename does not need refactoring. Do exactly what the instruction says, then stop.

<context>
<file_name>{fileName}</file_name>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>

{documentation}

<instruction>
{instruction}
</instruction>

<editing_rules>
SCOPE DISCIPLINE:
- Only modify what the instruction explicitly asks for. Do not touch code outside the scope of the request.
- Do NOT add features, refactor, or make "improvements" beyond what was asked.
- Do NOT add comments, docstrings, or type annotations to code you did not change.
- Do NOT create helpers, utilities, or abstractions for one-time operations.
- If removing code, delete it completely. Do not leave commented-out code, compatibility shims, or "// removed" markers.

MATCH THE CODEBASE:
- Infer language from file_name extension. Produce only valid syntax for that language.
- Preserve the exact indentation style (tabs vs spaces, indent width) from the selected code.
- Match naming conventions visible in full_code_context (camelCase vs snake_case, const vs let, quote style, semicolons).
- If the code uses specific frameworks or libraries (visible in imports), use idiomatic patterns for those.

QUALITY:
- Never introduce security vulnerabilities (injection, XSS, eval of untrusted input, hardcoded secrets).
- Do not add error handling for impossible scenarios or unnecessary validation. Trust internal code and framework guarantees — only validate at system boundaries.
- Edited code must be syntactically valid and functionally correct in the context of full_code_context.
- If the instruction is ambiguous, interpret it in the context of software engineering and the surrounding code. For example, "make this faster" means optimize the algorithm, not add a comment saying it's fast.

WHEN TO RETURN UNCHANGED:
- If the instruction cannot be applied to the selected code, return it unchanged.
- If the instruction asks for something already done in the selected code, return it unchanged.
- Do not guess at unclear intent — preserve the original over making a wrong edit.
</editing_rules>

<output_format>
Return ONLY the edited version of the selected code.
No explanations, no markdown fences, no backticks wrapping the output, no "Here's the edited code:" preamble.
Your output directly replaces the selected code in the editor.
</output_format>`;
