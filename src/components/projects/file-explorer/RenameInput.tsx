import { ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { getItemPadding } from "@/constants";
import { cn } from "@/lib/utils";
import { Doc } from "@convex/_generated/dataModel";

interface Props {
  type: "file" | "folder";
  defaultValue: string;
  isOpen: boolean;
  siblings?: Doc<"files">[];
  onSubmit: (newName: string) => void;
  level: number;
  onCancel: () => void;
}

const RenameInput = ({
  type,
  defaultValue,
  isOpen,
  siblings,
  onSubmit,
  level,
  onCancel,
}: Props) => {
  const [value, setValue] = useState(defaultValue);

  const error = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === defaultValue) return null;

    const exists = siblings?.some((f) => f.name === trimmed && f.type === type);

    if (exists) {
      return `A ${type} with this name already exists`;
    }

    return null;
  }, [value, siblings, type, defaultValue]);

  const handleSubmit = () => {
    if (error) {
      onCancel();
      return;
    }

    const trimmedValue = value.trim() || defaultValue;
    if (trimmedValue) {
      onSubmit(trimmedValue);
    }
  };

  return (
    <div>
      <div
        className="w-full flex items-center gap-1 h-5.5 bg-accent/30"
        style={{ paddingLeft: getItemPadding(level, type === "file") }}
      >
        <div className="flex items-center gap-0.5">
          {type === "folder" && (
            <ChevronRightIcon
              className={cn(
                "size-4 shrink-0 text-muted-foreground",
                isOpen && "rotate-90"
              )}
            />
          )}
          {type === "file" && (
            <FileIcon
              className="size-4 text-muted-foreground"
              fileName={value}
              autoAssign
            />
          )}
          {type === "folder" && (
            <FolderIcon
              className="size-4 text-muted-foreground"
              folderName={value}
            />
          )}
        </div>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            "flex-1 bg-transparent text-sm outline-none focus:ring-1 focus:ring-inset focus:ring-ring",
            error && "focus:ring-destructive"
          )}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
            if (e.key === "Escape") {
              onCancel();
            }
          }}
          onFocus={(e) => {
            if (type === "folder") {
              e.currentTarget.select();
            } else {
              const value = e.currentTarget.value;
              const lastDotIndex = value.lastIndexOf(".");
              if (lastDotIndex > 0) {
                e.currentTarget.setSelectionRange(0, lastDotIndex);
              } else {
                e.currentTarget.select();
              }
            }
          }}
        />
      </div>
      {error && (
        <p
          className="text-xs text-destructive py-0.5"
          style={{ paddingLeft: getItemPadding(level, type === "file") }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default RenameInput;
