"use client";

import { cn } from "@/lib/utils";
import { Doc } from "@convex/_generated/dataModel";
import { Allotment } from "allotment";
import { useState } from "react";
import { FiGithub } from "react-icons/fi";
import { FileExplorer } from "./file-explorer";

interface Props {
  projectId: Doc<"projects">["id"];
}

const Tab = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 h-full text-muted-foreground px-3 cursor-pointer border-r hover:bg-accent/30",
        isActive && "bg-sidebar text-foreground"
      )}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
};

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectView = ({ projectId }: Props) => {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  return (
    <div className="h-full flex flex-col">
      <nav className="h-[35px] flex items-center border-b">
        <Tab
          label="Code"
          isActive={activeView === "editor"}
          onClick={() => setActiveView("editor")}
        />
        <Tab
          label="Preview"
          isActive={activeView === "preview"}
          onClick={() => setActiveView("preview")}
        />

        <div className="flex-1 flex justify-end h-full">
          <div className="flex items-center gap-1.5 h-full text-muted-foreground px-3 cursor-pointer border-l hover:bg-accent/30">
            <FiGithub className="size-3.5" />
            <span className="text-sm">Export</span>
          </div>
        </div>
      </nav>
      <div className="flex-1 relative">
        <div
          className={cn(
            "absolute inset-0",
            activeView === "editor" ? "visible" : "invisible"
          )}
        >
          <Allotment defaultSizes={[DEFAULT_MAIN_SIZE, DEFAULT_SIDEBAR_WIDTH]}>
            <Allotment.Pane
              snap
              minSize={MIN_SIDEBAR_WIDTH}
              maxSize={MAX_SIDEBAR_WIDTH}
              preferredSize={DEFAULT_SIDEBAR_WIDTH}
            >
              <FileExplorer projectId={projectId} />
            </Allotment.Pane>
            <Allotment.Pane>
              <p>Editor View</p>
            </Allotment.Pane>
          </Allotment>
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeView === "preview" ? "visible" : "invisible"
          )}
        >
          <div>Preview</div>
        </div>
      </div>
    </div>
  );
};
