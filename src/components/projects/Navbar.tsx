"use client";

import { Doc } from "@convex/_generated/dataModel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import Link from "next/link";
import { Box, FileCheck, Loader2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useProjectById, useRenameProject } from "@/hooks/use-projects";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { formatTimestamp } from "@/lib/utils";

interface Props {
  projectId: Doc<"projects">["id"];
}

export const Navbar = ({ projectId }: Props) => {
  const project = useProjectById(projectId);
  const renameProject = useRenameProject(projectId);

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState("");

  const handleStartRename = () => {
    if (!project) return;

    setName(project.name);
    setIsRenaming(true);
  };

  const handleSubmit = () => {
    if (!project) return;
    setIsRenaming(false);

    const trimmedName = name.trim();

    if (!trimmedName || trimmedName === project.name) return;

    renameProject({ id: projectId, name: trimmedName });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
    }
  };

  return (
    <nav className="flex justify-between items-center gap-x-2 px-4 py-2.5 bg-background border-b">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center group/logo" asChild>
                <Button variant="ghost" className="w-fit! p-1.5! h-7">
                  <Link href="/" className="flex items-center gap-x-2">
                    <Box className="size-5" />
                    <span className="text-sm font-medium">
                      Build <span className="font-mono">AI</span>
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="ml-0 mr-1" />
            <BreadcrumbItem>
              {isRenaming ? (
                <input
                  type="text"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="text-sm bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-ring font-medium max-w-40 truncate"
                />
              ) : (
                <BreadcrumbPage
                  className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 truncate"
                  onClick={handleStartRename}
                >
                  {project?.name ?? <Skeleton className="w-20 h-4 rounded" />}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </TooltipTrigger>
            <TooltipContent>Importing...</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <FileCheck className="size-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              Saved {project?.updatedAt && formatTimestamp(project.updatedAt)}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex items-center gap-x-2">
        <UserButton />
      </div>
    </nav>
  );
};
