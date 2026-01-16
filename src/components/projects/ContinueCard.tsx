import { Doc } from "@convex/_generated/dataModel";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatTimestamp, getProjectIcon } from "./ProjectItem";
import { ArrowRightIcon } from "lucide-react";

interface Props {
  project: Doc<"projects">;
}

export const ContinueCard = ({ project }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Last updated</span>
      <Button
        variant="outline"
        asChild
        className="h-auto items-start justify-start p-4 bg-background border rounded-none flex flex-col gap-2"
      >
        <Link href={`/projects/${project.id}`} className="group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getProjectIcon(project)}
              <span className="truncate font-medium">{project.name}</span>
            </div>

            <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
            {formatTimestamp(project.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  );
};
