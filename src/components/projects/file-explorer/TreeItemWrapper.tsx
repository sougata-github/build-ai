import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuContent,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Doc } from "@convex/_generated/dataModel";
import { getItemPadding } from "@/constants";
import { Command } from "lucide-react";

interface Props {
  item: Doc<"files">;
  children: React.ReactNode;
  level?: number;
  isActive?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
}

const TreeItemWrapper = ({
  item,
  children,
  level = 0,
  isActive,
  onClick,
  onDoubleClick,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
}: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onRename?.();
            }
          }}
          className={cn(
            "group flex items-center gap-1 w-full h-5.5 hover:bg-accent/30 outline-none foucs:ring-1 foucs:ring-inset focus:ring-ring",
            isActive && "bg-accent/30"
          )}
          style={{ paddingLeft: getItemPadding(level, item.type === "file") }}
        >
          {children}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-64"
      >
        {item.type === "folder" && (
          <>
            <ContextMenuItem
              onClick={onCreateFile}
              className="text-xs font-medium"
            >
              New File
            </ContextMenuItem>
            <ContextMenuItem
              onClick={onCreateFolder}
              className="text-xs font-medium"
            >
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem onClick={onRename} className="text-xs font-medium">
          Rename
          <ContextMenuShortcut className="font-mono">Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-xs">
          Delete
          <ContextMenuShortcut className="inline-flex items-center gap-0.5">
            <Command className="size-3" />
            <span className="text-xs font-mono">Backspace</span>
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TreeItemWrapper;
