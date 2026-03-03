"use client";

import { keymap } from "@codemirror/view";
import { useEffect, useMemo, useRef } from "react";
import { EditorView } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { vercel as customTheme } from "@/lib/editor-theme";
import { getLanguageExtensions } from "@/lib/language-extension";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { customSetup } from "@/lib/custom-setup";
import { suggestion } from "@/lib/suggestion";

interface Props {
  fileName: string;
  initialValue?: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ fileName, initialValue = "", onChange }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const languageExtension = useMemo(() => {
    return getLanguageExtensions(fileName);
  }, [fileName]);

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: initialValue,
      parent: editorRef.current,
      extensions: [
        customTheme,
        customSetup,
        languageExtension,
        // suggestion(fileName),
        keymap.of([indentWithTab]),
        indentationMarkers(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    viewRef.current = view;
    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageExtension]);

  return <div ref={editorRef} className="size-full"></div>;
};

export default CodeEditor;
