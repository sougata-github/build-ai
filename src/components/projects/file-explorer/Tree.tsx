import {
  useCreateFile,
  useCreateFolder,
  useDeleteFile,
  useFolderContents,
  useRenameFile,
} from "@/hooks/use-files";
import { useState } from "react";
import { Doc } from "@convex/_generated/dataModel";
import TreeItemWrapper from "./TreeItemWrapper";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingRow from "./LoadingRow";
import { getItemPadding } from "@/constants";
import CreateInput from "./CreateInput";
import RenameInput from "./RenameInput";
import { toast } from "sonner";

interface Props {
  item: Doc<"files">;
  siblings?: Doc<"files">[];
  level?: number;
  projectId: Doc<"projects">["id"];
}

const Tree = ({ item, siblings, level = 0, projectId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();
  const createFile = useCreateFile();
  const createFolder = useCreateFolder();

  const folderContents = useFolderContents({
    projectId,
    parentId: item.id,
    enabled: item.type === "folder" && isOpen,
  });

  const handleCreate = (name: string) => {
    setCreating(null);

    const mutation =
      creating === "file"
        ? createFile({ projectId, parentId: item.id, name, content: "" })
        : createFolder({ projectId, parentId: item.id, name });

    mutation.catch((error: Error) => {
      toast.error(error.message);
    });
  };

  const handleRename = (newName: string) => {
    setIsRenaming(false);
    if (newName === item.name) return;

    renameFile({ id: item.id, name: newName }).catch((error: Error) => {
      toast.error(error.message);
    });
  };

  const startCreating = (type: "file" | "folder") => {
    setIsOpen(true);
    setCreating(type);
  };

  if (item.type === "file") {
    const fileName = item.name;

    if (isRenaming) {
      return (
        <RenameInput
          defaultValue={fileName}
          type={item.type}
          isOpen={isOpen}
          siblings={siblings}
          onSubmit={handleRename}
          level={level}
          onCancel={() => setIsRenaming(false)}
        />
      );
    }

    return (
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => {}}
        onDoubleClick={() => {}}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          //close tab
          deleteFile({ id: item.id }).catch((error: Error) => {
            toast.error(error.message);
          });
        }}
      >
        <FileIcon fileName={fileName} autoAssign className="size-4" />
        <span className="truncate text-sm">{fileName}</span>
      </TreeItemWrapper>
    );
  }

  const folderName = item.name;

  const folderRender = (
    <>
      <div className="flex items-center gap-0.5">
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-forgeround",
            isOpen && "rotate-90"
          )}
        />
        <FolderIcon folderName={folderName} className="size-4" />
        <span className="truncate text-sm">{folderName}</span>
      </div>
    </>
  );

  if (creating) {
    return (
      <>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex items-center gap-1 h-5.5 hover:bg-accent/30 w-full"
          style={{ paddingLeft: getItemPadding(level, false) }}
        >
          {folderRender}
        </button>
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}
            <CreateInput
              type={creating}
              siblings={folderContents}
              onSubmit={handleCreate}
              level={level + 1}
              onCancel={() => setCreating(null)}
            />
          </>
        )}
        {folderContents?.map((subItem) => (
          <Tree
            key={subItem.id}
            item={subItem}
            siblings={folderContents}
            level={level + 1}
            projectId={projectId}
          />
        ))}
      </>
    );
  }

  if (isRenaming) {
    return (
      <>
        <RenameInput
          defaultValue={folderName}
          type={item.type}
          isOpen={isOpen}
          siblings={siblings}
          onSubmit={handleRename}
          level={level}
          onCancel={() => setIsRenaming(false)}
        />
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}
            {folderContents?.map((subItem) => (
              <Tree
                key={subItem.id}
                item={subItem}
                siblings={folderContents}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => setIsOpen((prev) => !prev)}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          //close tab
          deleteFile({ id: item.id }).catch((error: Error) => {
            toast.error(error.message);
          });
        }}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}
      >
        {folderRender}
      </TreeItemWrapper>
      {isOpen && (
        <>
          {folderContents === undefined && <LoadingRow level={level + 1} />}
          {folderContents?.map((subItem) => (
            <Tree
              key={subItem.id}
              item={subItem}
              siblings={folderContents}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Tree;
