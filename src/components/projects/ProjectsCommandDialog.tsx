"use client";

import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useProjects } from "@/hooks/use-projects";
import { ClientOnly } from "@/components/providers/ClientOnly";
import { getProjectIcon } from "./ProjectItem";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectsCommandDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const projects = useProjects();

  const handleSelectProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    onOpenChange(false);
  };

  return (
    <ClientOnly>
      <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Search Projects"
        description="Search and navigate to your projects"
      >
        <CommandInput placeholder="Search projects..." />
        <CommandList>
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup heading="Recent Projects">
            {projects?.map((project) => (
              <CommandItem
                key={project.id}
                value={`${project.name}-${project.id}`}
                onSelect={() => handleSelectProject(project.id)}
              >
                {getProjectIcon(project)}{" "}
                <span className="truncate">{project.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </ClientOnly>
  );
};
