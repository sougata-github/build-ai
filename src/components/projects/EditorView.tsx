import { Doc } from "@convex/_generated/dataModel";
import TopNavigation from "./TopNavigation";
import { useEditor } from "@/hooks/use-editor";
import FileBreadCrumbs from "./FileBreadCrumbs";
import { useFile, useUpdateFile } from "@/hooks/use-files";
import { Box } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { useRef } from "react";

interface Props {
  projectId: Doc<"projects">["id"];
}

const DEBOUNCE_MS = 1500;

const EditorView = ({ projectId }: Props) => {
  const { activeTabId } = useEditor({ projectId });
  const activeFile = useFile(activeTabId);
  const updateFile = useUpdateFile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveFileBinary = activeFile && activeFile.storageId;
  const isActiveFileText = activeFile && !activeFile.storageId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>
      {activeTabId && <FileBreadCrumbs projectId={projectId} />}
      <div className="flex-1 min-h-0 bg-background">
        {!activeFile && (
          <div className="size-full flex items-center justify-center">
            <Box className="size-10 text-muted-foreground opacity-25" />
          </div>
        )}
        {isActiveFileText && (
          <CodeEditor
            key={activeFile._id}
            fileName={activeFile.name}
            initialValue={activeFile.content ?? ""}
            onChange={(content: string) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                updateFile({ id: activeFile.id, content: content });
              }, DEBOUNCE_MS);
            }}
          />
        )}
        {isActiveFileBinary && <p>Implement binary file editor</p>}
      </div>
    </div>
  );
};

export default EditorView;
