import { EditorView, keymap, showTooltip, Tooltip } from "@codemirror/view";
import {
  EditorState,
  Extension,
  StateEffect,
  StateField,
} from "@codemirror/state";
import ky from "ky";
import { z } from "zod";
import { toast } from "sonner";

const quickEditRequestSchema = z.object({
  selectedCode: z.string(),
  fullCode: z.string(),
  instruction: z.string(),
  fileName: z.string(),
});

const quickEditResponseSchema = z.object({
  editedCode: z.string(),
});

type QuickEditResponse = z.infer<typeof quickEditResponseSchema>;
type QuickEditRequest = z.infer<typeof quickEditRequestSchema>;

export const quickEditFetcher = async (
  payload: QuickEditRequest,
  signal?: AbortSignal
): Promise<string | null> => {
  try {
    const validatedPayload = quickEditRequestSchema.parse(payload);

    const response = await ky
      .post("/api/quick-edit", {
        json: validatedPayload,
        signal,
        timeout: 30_000,
        retry: 0,
      })
      .json<QuickEditResponse>();

    const validatedResponse = quickEditResponseSchema.parse(response);
    return validatedResponse.editedCode || null;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    console.error("Error fetching quick edit:", error);
    toast.error("Failed to fetch AI edit");
    return null;
  }
};

export const showQuickEditEffect = StateEffect.define<boolean>();

let quickEditAbortController: AbortController | null = null;

export const quickEditState = StateField.define<boolean>({
  create() {
    return false;
  },
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(showQuickEditEffect)) {
        return effect.value;
      }
    }
    if (transaction.selection) {
      const selection = transaction.state.selection.main;
      if (selection.empty) {
        return false;
      }
    }
    return value;
  },
});

const createQuickEditTooltip = (
  state: EditorState,
  fileName: string
): readonly Tooltip[] => {
  const selection = state.selection.main;
  if (selection.empty) return [];

  const isQuickEditActive = state.field(quickEditState);
  if (!isQuickEditActive) return [];

  return [
    {
      pos: selection.to,
      above: false,
      strictSide: false,
      create(view: EditorView) {
        const dom = document.createElement("div");
        dom.className =
          "bg-popover text-popover-foreground z-50 rounded-sm border border-input p-2 shadow-md flex flex-col gap-2 text-sm";

        const form = document.createElement("form");
        form.className = "flex flex-col gap-2";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Edit selected code";
        input.className =
          "bg-transparent border-none outline-none px-2 py-1 font-sans w-100";
        input.autofocus = true;

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex gap-2 items-center justify-between";

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = "Cancel";
        cancelButton.className =
          "font-sans p-1 px-2 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-sm";

        cancelButton.onclick = () => {
          if (quickEditAbortController) {
            quickEditAbortController.abort();
            quickEditAbortController = null;
          }
          view.dispatch({
            effects: showQuickEditEffect.of(false),
          });
        };

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Submit";
        submitButton.className =
          "font-sans p-1 px-2 text-foreground hover:bg-foreground/10 rounded-sm";

        form.onsubmit = async (e) => {
          e.preventDefault();

          const instruction = input.value.trim();
          if (!instruction) return;

          const sel = view.state.selection.main;
          const selectedCode = view.state.doc.sliceString(sel.from, sel.to);
          const fullCode = view.state.doc.toString();

          submitButton.disabled = true;
          submitButton.textContent = "";
          const loader = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          loader.setAttribute("viewBox", "0 0 24 24");
          loader.setAttribute("fill", "none");
          loader.setAttribute("stroke", "currentColor");
          loader.setAttribute("stroke-width", "2");
          loader.setAttribute("stroke-linecap", "round");
          loader.setAttribute("stroke-linejoin", "round");
          loader.classList.add("size-3", "animate-spin");
          loader.innerHTML = '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>';
          submitButton.appendChild(loader);

          quickEditAbortController = new AbortController();
          const editedCode = await quickEditFetcher(
            {
              selectedCode,
              fullCode,
              instruction,
              fileName,
            },
            quickEditAbortController.signal
          );

          if (editedCode) {
            view.dispatch({
              changes: {
                from: sel.from,
                to: sel.to,
                insert: editedCode,
              },
              selection: { anchor: sel.from + editedCode.length },
              effects: showQuickEditEffect.of(false),
            });
          } else {
            submitButton.disabled = false;
            submitButton.textContent = "Submit";
          }

          quickEditAbortController = null;
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);
        form.appendChild(input);
        form.appendChild(buttonContainer);
        dom.appendChild(form);

        setTimeout(() => input.focus(), 0);

        return { dom };
      },
    },
  ];
};

export const quickEdit = (fileName: string): Extension[] => {
  const quickEditTooltipField = StateField.define<readonly Tooltip[]>({
    create(state) {
      return createQuickEditTooltip(state, fileName);
    },
    update(tooltips, transaction) {
      if (transaction.docChanged || transaction.selection) {
        return createQuickEditTooltip(transaction.state, fileName);
      }

      for (const effect of transaction.effects) {
        if (effect.is(showQuickEditEffect)) {
          return createQuickEditTooltip(transaction.state, fileName);
        }
      }
      return tooltips;
    },
    provide: (field) =>
      showTooltip.computeN([field], (state) => state.field(field)),
  });

  const quickEditKeymap = keymap.of([
    {
      key: "Mod-k",
      run: (view) => {
        const selection = view.state.selection.main;
        if (selection.empty) {
          return false;
        }

        view.dispatch({
          effects: showQuickEditEffect.of(true),
        });

        return true;
      },
    },
  ]);

  return [quickEditState, quickEditTooltipField, quickEditKeymap];
};
