import { useEditor } from "@/hooks/use-editor";
import { useFile } from "@/hooks/use-files";
import { cn } from "@/lib/utils";
import { Doc } from "@convex/_generated/dataModel";
import { Spinner } from "../ui/spinner";
import { FileIcon } from "@react-symbols/icons/utils";
import { XIcon } from "lucide-react";

interface Props {
  isFirst: boolean;
  fileId: Doc<"files">["id"];
  projectId: Doc<"projects">["id"];
}

const Tab = ({ fileId, isFirst, projectId }: Props) => {
  const file = useFile(fileId);
  const { activeTabId, previewTabId, setActiveTab, openFile, closeTab } =
    useEditor({ projectId });

  const isActive = activeTabId === fileId;
  const isPreview = previewTabId === fileId;
  const fileName = file?.name ?? "Loading...";

  return (
    <div
      onClick={() => setActiveTab(fileId)}
      onDoubleClick={() => openFile(fileId, { pinned: true })}
      className={cn(
        "flex items-center gap-2 h-[35px] pl-2 pr-1.5 cursor-pointer text-muted-foreground hover:bg-accent/30 border border-transparent group",
        isFirst && "border-l-transparent!",
        isActive &&
          "bg-background text-foreground -mb-px drop-shadow border-b-background"
      )}
    >
      {file === undefined ? (
        <Spinner className="text-ring" />
      ) : (
        <FileIcon fileName={fileName} autoAssign className="size-4" />
      )}
      <span className={cn("text-sm whitespace-nowrap", isPreview && "italic")}>
        {fileName}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeTab(fileId);
        }}
        className={cn(
          "p-0.5 rounded-sm hover:bg-background/10 opacity-0 group-hover:opacity-100 cursor-pointer",

          isActive && "opacity-100"
        )}
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  );
};

export default Tab;
