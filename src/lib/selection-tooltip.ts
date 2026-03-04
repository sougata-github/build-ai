import { EditorState, StateField } from "@codemirror/state";
import { EditorView, showTooltip, Tooltip } from "@codemirror/view";
import { quickEditState, showQuickEditEffect } from "./quick-edit";

const createTooltipForSelection = (state: EditorState): readonly Tooltip[] => {
  const selection = state.selection.main;
  if (selection.empty) return [];

  const isQuickEditActive = state.field(quickEditState);

  if (isQuickEditActive) return [];

  return [
    {
      pos: selection.to,
      above: false,
      strictSide: false,
      create(view: EditorView) {
        const dom = document.createElement("div");

        dom.className =
          "bg-popover text-popover-foreground z-50 rounded-sm border border-input p-2 shadow-md flex items-center gap-0.5 text-xs";

        const addToChatButton = document.createElement("button");
        addToChatButton.textContent = "Add to Chat";
        addToChatButton.className =
          "font-sans p-1.5 hover:bg-foreground/10 rounded-sm";

        const quickEditButton = document.createElement("button");
        quickEditButton.className =
          "font-sans p-1.5 hover:bg-foreground/10 rounded-sm flex items-center gap-1";

        const quickEditLabel = document.createTextNode("Quick Edit");
        const quickEditShortcut = document.createElement("span");
        quickEditShortcut.className = "text-xs opacity-60";
        quickEditShortcut.textContent = "⌘+K";

        quickEditButton.appendChild(quickEditLabel);
        quickEditButton.appendChild(quickEditShortcut);

        quickEditButton.onclick = () => {
          view.dispatch({
            effects: showQuickEditEffect.of(true),
          });
        };

        dom.appendChild(addToChatButton);
        dom.appendChild(quickEditButton);

        return { dom };
      },
    },
  ];
};

const selectionTooltipField = StateField.define<readonly Tooltip[]>({
  create(state) {
    return createTooltipForSelection(state);
  },
  update(tooltips, transaction) {
    if (transaction.docChanged || transaction.selection) {
      return createTooltipForSelection(transaction.state);
    }

    for (const effect of transaction.effects) {
      if (effect.is(showQuickEditEffect)) {
        return createTooltipForSelection(transaction.state);
      }
    }
    return tooltips;
  },
  provide: (field) =>
    showTooltip.computeN([field], (state) => state.field(field)),
});

export const selectionTooltip = () => {
  return [selectionTooltipField];
};
