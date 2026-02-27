import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const bg = "#0a0a0a",
  fg = "#ededed",
  fgMuted = "#a1a1aa",
  gutterFg = "#3a3a3a",
  caret = "#528bff",
  selection = "#ffffff12",
  activeLine = "#ffffff08",
  activeLineGutter = "#ffffff08",
  matchBracket = "#ffffff1a",
  tooltipBg = "#171717",
  panelBg = "#141414",
  searchMatch = "#ffffff15",
  searchMatchSelected = "#528bff33";

const purple = "#c084fc",
  green = "#4ade80",
  orange = "#fb923c",
  blue = "#60a5fa",
  cyan = "#22d3ee",
  pink = "#f472b6",
  violet = "#a78bfa",
  amber = "#fbbf24",
  zinc500 = "#71717a",
  zinc600 = "#525252";

const vercelTheme = EditorView.theme(
  {
    "&": {
      color: fg,
      backgroundColor: bg,
      outline: "none !important",
    },
    ".cm-content": {
      caretColor: caret,
      fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
      fontSize: "13px",
      lineHeight: "1.6",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: caret,
      borderLeftWidth: "1.5px",
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: selection,
      },
    ".cm-panels": {
      backgroundColor: panelBg,
      color: fg,
    },
    ".cm-panels.cm-panels-top": {
      borderBottom: "1px solid #262626",
    },
    ".cm-panels.cm-panels-bottom": {
      borderTop: "1px solid #262626",
    },
    ".cm-searchMatch": {
      backgroundColor: searchMatch,
      outline: "1px solid #525252",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: searchMatchSelected,
    },
    ".cm-activeLine": {
      backgroundColor: activeLine,
    },
    ".cm-selectionMatch": {
      backgroundColor: "#ffffff0d",
    },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: matchBracket,
      outline: "1px solid #404040",
    },
    ".cm-gutters": {
      backgroundColor: bg,
      color: gutterFg,
      border: "none",
      paddingRight: "4px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: activeLineGutter,
      color: fgMuted,
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#262626",
      border: "none",
      color: zinc500,
      borderRadius: "2px",
      padding: "0 4px",
    },
    ".cm-tooltip": {
      border: "1px solid #262626",
      backgroundColor: tooltipBg,
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: tooltipBg,
      borderBottomColor: tooltipBg,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "#ffffff0d",
        color: fg,
      },
    },
    ".cm-scroller": {
      fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-line": {
      padding: "0 8px",
    },
  },
  { dark: true }
);

const vercelHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: purple },
  {
    tag: [tags.name, tags.deleted, tags.character, tags.macroName],
    color: fg,
  },
  {
    tag: [tags.function(tags.variableName), tags.labelName],
    color: blue,
  },
  { tag: [tags.propertyName], color: pink },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: orange,
  },
  {
    tag: [tags.definition(tags.name), tags.separator],
    color: fg,
  },
  {
    tag: [
      tags.typeName,
      tags.className,
      tags.changed,
      tags.annotation,
      tags.modifier,
      tags.self,
      tags.namespace,
    ],
    color: cyan,
  },
  { tag: tags.number, color: orange },
  {
    tag: [
      tags.operator,
      tags.operatorKeyword,
      tags.url,
      tags.escape,
      tags.regexp,
      tags.link,
      tags.special(tags.string),
    ],
    color: zinc500,
  },
  { tag: tags.regexp, color: amber },
  { tag: [tags.meta, tags.comment], color: zinc600, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.link, color: blue, textDecoration: "underline" },
  { tag: tags.heading, fontWeight: "bold", color: fg },
  {
    tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
    color: orange,
  },
  {
    tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: green,
  },
  { tag: tags.invalid, color: "#ff5555" },
  { tag: tags.tagName, color: pink },
  { tag: tags.attributeName, color: violet },
  { tag: tags.attributeValue, color: green },
]);

export const vercel = [vercelTheme, syntaxHighlighting(vercelHighlightStyle)];
