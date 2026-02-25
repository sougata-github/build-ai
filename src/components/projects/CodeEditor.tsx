"use client";

import { useEffect, useRef } from "react";
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vercel } from "./EditorTheme";

const CodeEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: `const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
      parent: editorRef.current,
      extensions: [
        vercel,
        basicSetup,
        javascript({ jsx: true, typescript: true }),
      ],
    });

    viewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editorRef} className="size-full"></div>;
};

export default CodeEditor;
