import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  CopyMinus,
  FilePlusCorner,
  FolderPlus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Doc } from "@convex/_generated/dataModel";
import { useProjectById } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents,
} from "@/hooks/use-files";
import CreateInput from "./CreateInput";
import LoadingRow from "./LoadingRow";
import Tree from "./Tree";
import { toast } from "sonner";

interface Props {
  projectId: Doc<"projects">["id"];
}

export const FileExplorer = ({ projectId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const project = useProjectById(projectId);

  const [collapseKey, setCollapseKey] = useState(0);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const rootFiles = useFolderContents({
    projectId,
    enabled: isOpen,
  });

  const handleCreate = (name: string) => {
    setCreating(null);

    const mutation =
      creating === "file"
        ? createFile({ projectId, parentId: undefined, name, content: "" })
        : createFolder({ projectId, parentId: undefined, name });

    mutation.catch((error: Error) => {
      toast.error(error.message);
    });
  };

  return (
    <div className="h-full">
      <ScrollArea>
        <div
          role="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-[22px] bg-accent font-bold p-1"
        >
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-90"
            )}
          />
          <p className="text-xs line-clamp-1 uppercase">
            {project?.name ?? "Loading..."}
          </p>

          <div
            className="opacity-0 group-hover/project:opacity-100 transition-none duration-0 flex items-center gap-0.5 ml-auto
          "
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("file");
              }}
              variant="highlight"
              size="icon-xs"
            >
              <FilePlusCorner className="size-3.5" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("folder");
              }}
              variant="highlight"
              size="icon-xs"
            >
              <FolderPlus className="size-3.5" />
            </Button>
            {/* collapse open folders */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCollapseKey((prev) => prev + 1);
              }}
              variant="highlight"
              size="icon-xs"
            >
              <CopyMinus className="size-3.5" />
            </Button>
          </div>
        </div>
        {isOpen && (
          <>
            {rootFiles === undefined && <LoadingRow level={0} />}
            {creating && (
              <CreateInput
                type={creating}
                siblings={rootFiles}
                onSubmit={handleCreate}
                level={0}
                onCancel={() => setCreating(null)}
              />
            )}
            {rootFiles?.map((item) => (
              <Tree
                key={`${item.id}-${collapseKey}`}
                item={item}
                siblings={rootFiles}
                level={0}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
};
