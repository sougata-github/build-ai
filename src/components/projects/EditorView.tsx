import { Doc } from "@convex/_generated/dataModel";
import TopNavigation from "./TopNavigation";
import { useEditor } from "@/hooks/use-editor";
import FileBreadCrumbs from "./FileBreadCrumbs";
import { useFile } from "@/hooks/use-files";
import { Box } from "lucide-react";
import CodeEditor from "./CodeEditor";

interface Props {
  projectId: Doc<"projects">["id"];
}

const EditorView = ({ projectId }: Props) => {
  const { activeTabId } = useEditor({ projectId });
  const activeFile = useFile(activeTabId);

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
        {activeFile && <CodeEditor />}
      </div>
    </div>
  );
};

export default EditorView;
