import { getItemPadding } from "@/constants";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Props {
  className?: string;
  level?: number;
}

const LoadingRow = ({ className, level = 0 }: Props) => {
  return (
    <div
      className={cn("h-5.5 flex items-center text-muted-foreground", className)}
      style={{ paddingLeft: getItemPadding(level, true) }}
    >
      <Loader2 className="size-4 text-ring animate-spin ml-0.5" />
    </div>
  );
};

export default LoadingRow;
