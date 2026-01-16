"use client";

import { Doc } from "@convex/_generated/dataModel";
import { AlertCircleIcon, Folder, Loader2Icon } from "lucide-react";
import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
import { FiGithub } from "react-icons/fi";

export const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(timestamp, { addSuffix: true });
};

interface Props {
  project: Doc<"projects">;
}

export const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed")
    return <FiGithub className="size-4.5 text-muted-foreground" />;

  if (project.importStatus === "failed")
    return <AlertCircleIcon className="size-4.5 text-muted-foreground" />;

  if (project.importStatus === "importing")
    return (
      <Loader2Icon className="size-4.5 text-muted-foreground animate-spin" />
    );

  return <Folder className="size-4.5 text-muted-foreground" />;
};

export const ProjectItem = ({ project }: Props) => {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex items-center justify-between gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors py-1 w-full group"
    >
      <div className="flex items-center gap-2">
        {getProjectIcon(project)}
        <span className="truncate">{project.name}</span>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
        {formatTimestamp(project.updatedAt)}
      </span>
    </Link>
  );
};
