"use client";

import { Box, Command, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { FiGithub } from "react-icons/fi";
import { ProjectsList } from "./ProjectsList";
import { useCreateProject } from "@/hooks/use-projects";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ProjectsCommandDialog } from "./ProjectsCommandDialog";

export const ProjectsView = () => {
  const createProject = useCreateProject();
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);

  const handleCreateProject = async (projectName: string) => {
    await createProject({ name: projectName });
    toast.success("New Project created");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
          <div className="flex justify-center gap-4 w-full items-center">
            <div className="flex items-center gap-2 group/logo">
              <Box className="size-8 md:size-12" />
              <h1 className="text-4xl md:text-5xl font-semibold">
                Build <span className="font-mono">AI</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const projectName = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors],
                    separator: "-",
                    length: 3,
                  });

                  handleCreateProject(projectName);
                }}
                className="h-full items-start justify-start p-4 border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <Plus className="size-5" />
                  <Kbd className="bg-accent border">
                    <Command className="size-3" /> + J
                  </Kbd>
                </div>

                <div>
                  <span className="text-sm font-mono">New Project</span>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => {}}
                className="h-full items-start justify-start p-4 border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <FiGithub className="size-5" />
                  <Kbd className="bg-accent border">
                    <Command className="size-3" /> + I
                  </Kbd>
                </div>

                <div>
                  <span className="text-sm font-mono">Import Project</span>
                </div>
              </Button>
            </div>

            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
          </div>
        </div>
      </div>
    </>
  );
};
