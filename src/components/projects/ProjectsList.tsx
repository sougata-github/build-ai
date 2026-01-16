"use client";

import { Spinner } from "../ui/spinner";
import { Kbd } from "../ui/kbd";
import { Command } from "lucide-react";
import { useProjectsPartial } from "@/hooks/use-projects";
import { ProjectItem } from "./ProjectItem";
import { ContinueCard } from "./ContinueCard";

interface Props {
  onViewAll: () => void;
}

export const ProjectsList = ({ onViewAll }: Props) => {
  const { results, isLoading } = useProjectsPartial();

  if (isLoading || results === undefined)
    return <Spinner className="size-4 text-ring" />;

  const [mostRecentProject, ...restProjects] = results;

  return (
    <div className="flex flex-col gap-4">
      {mostRecentProject && <ContinueCard project={mostRecentProject} />}
      {restProjects.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              Recent Projects
            </span>
            <button
              className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
              onClick={onViewAll}
            >
              <span>View All</span>
              <Kbd>
                <Command className="size-3" /> + K
              </Kbd>
            </button>
          </div>

          <ul className="flex flex-col">
            {restProjects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
