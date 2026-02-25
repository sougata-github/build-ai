import { Doc } from "@convex/_generated/dataModel";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useEditor } from "@/hooks/use-editor";
import Tab from "./Tab";

interface Props {
  projectId: Doc<"projects">["id"];
}

const TopNavigation = ({ projectId }: Props) => {
  const { openTabs } = useEditor({ projectId });

  return (
    <ScrollArea className="flex-1">
      <nav className="bg-sidebar flex items-center h-[35px] border-b">
        {openTabs.map((fileId, index) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isFirst={index === 0}
            projectId={projectId}
          />
        ))}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default TopNavigation;
