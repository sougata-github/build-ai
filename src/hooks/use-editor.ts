import { useEditorStore } from "@/stores/editor-store";
import { Doc } from "@convex/_generated/dataModel";
import { useCallback } from "react";

export const useEditor = ({
  projectId,
}: {
  projectId: Doc<"projects">["id"];
}) => {
  const store = useEditorStore();
  const tabState = useEditorStore((state) => state.getTabState(projectId));

  const openFile = useCallback(
    (fileId: Doc<"files">["id"], options: { pinned: boolean }) => {
      store.openFile(projectId, fileId, options);
    },
    [store, projectId]
  );

  const closeTab = useCallback(
    (fileId: Doc<"files">["id"]) => {
      store.closeTab(projectId, fileId);
    },
    [store, projectId]
  );

  const closeAllTabs = useCallback(() => {
    store.closeAllTabs(projectId);
  }, [store, projectId]);

  const setActiveTab = useCallback(
    (fileId: Doc<"files">["id"]) => {
      store.setActiveTab(projectId, fileId);
    },
    [store, projectId]
  );

  return {
    openTabs: tabState.openTabs,
    activeTabId: tabState.activeTabId,
    previewTabId: tabState.previewTabId,
    openFile,
    closeTab,
    closeAllTabs,
    setActiveTab,
  };
};
