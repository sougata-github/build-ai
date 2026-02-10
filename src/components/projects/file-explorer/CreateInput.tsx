import { ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { getItemPadding } from "@/constants";
import { cn } from "@/lib/utils";
import { Doc } from "@convex/_generated/dataModel";

interface Props {
  type: "file" | "folder";
  siblings?: Doc<"files">[];
  onSubmit: (name: string) => void;
  level: number;
  onCancel: () => void;
}

const CreateInput = ({ type, siblings, onSubmit, level, onCancel }: Props) => {
  const [value, setValue] = useState("");

  const error = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const exists = siblings?.some((f) => f.name === trimmed && f.type === type);

    if (exists) {
      return `A ${type} with this name already exists`;
    }

    return null;
  }, [value, siblings, type]);

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue || error) {
      onCancel();
      return;
    }

    onSubmit(trimmedValue);
    setValue("");
  };

  return (
    <div>
      <div
        className="w-full flex items-center gap-1 h-5.5 bg-accent/30"
        style={{ paddingLeft: getItemPadding(level, type === "file") }}
      >
        <div className="flex items-center gap-0.5">
          {type === "folder" && (
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
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
        />
      </div>
      {error && (
        <p
          className="text-xs  text-destructive py-0.5"
          style={{ paddingLeft: getItemPadding(level, type === "file") }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default CreateInput;
