import { create } from "zustand";
import { Doc } from "@convex/_generated/dataModel";

interface TabState {
  openTabs: Doc<"files">["id"][];
  activeTabId: Doc<"files">["id"] | null;
  previewTabId: Doc<"files">["id"] | null;
}

const defaultTabState: TabState = {
  openTabs: [],
  activeTabId: null,
  previewTabId: null,
};

interface EditorStore {
  tabs: Map<Doc<"projects">["id"], TabState>;
  getTabState: (projectId: Doc<"projects">["id"]) => TabState;

  openFile: (
    projectId: Doc<"projects">["id"],
    fileId: Doc<"files">["id"],
    options: { pinned: boolean }
  ) => void;

  closeTab: (
    projectId: Doc<"projects">["id"],
    fileId: Doc<"files">["id"]
  ) => void;

  closeAllTabs: (projectId: Doc<"projects">["id"]) => void;

  setActiveTab: (
    projectId: Doc<"projects">["id"],
    fileId: Doc<"files">["id"]
  ) => void;
}

export const useEditorStore = create<EditorStore>()((set, get) => ({
  tabs: new Map(),
      getTabState: (projectId) => {
        return get().tabs.get(projectId) ?? defaultTabState;
      },

      openFile: (projectId, fileId, { pinned }) => {
        const tabs = new Map(get().tabs);
        const state = tabs.get(projectId) ?? defaultTabState;

        const { openTabs, previewTabId } = state;
        const isOpen = openTabs.includes(fileId);

        if (!isOpen && !pinned) {
          const newTabs = previewTabId
            ? openTabs.map((id) => (id === previewTabId ? fileId : id))
            : [...openTabs, fileId];

          tabs.set(projectId, {
            openTabs: newTabs,
            activeTabId: fileId,
            previewTabId: fileId,
          });

          set({ tabs });
          return;
        }

        if (!isOpen && pinned) {
          tabs.set(projectId, {
            ...state,
            openTabs: [...openTabs, fileId],
            activeTabId: fileId,
          });

          set({ tabs });
          return;
        }

        const shouldPin = pinned && previewTabId === fileId;

        tabs.set(projectId, {
          ...state,
          activeTabId: fileId,
          previewTabId: shouldPin ? null : previewTabId,
        });

        set({ tabs });
      },

      closeTab: (projectId, fileId) => {
        const tabs = new Map(get().tabs);
        const state = tabs.get(projectId) ?? defaultTabState;
        const { openTabs, activeTabId, previewTabId } = state;
        const tabIndex = openTabs.indexOf(fileId);

        if (tabIndex === -1) return;

        const newTabs = openTabs.filter((id) => id !== fileId);

        let newActiveTabId = activeTabId;

        if (activeTabId === fileId) {
          if (newTabs.length === 0) {
            newActiveTabId = null;
          } else if (tabIndex >= newTabs.length) {
            newActiveTabId = newTabs[newTabs.length - 1];
          } else {
            newActiveTabId = newTabs[tabIndex];
          }
        }

        tabs.set(projectId, {
          openTabs: newTabs,
          activeTabId: newActiveTabId,
          previewTabId: previewTabId === fileId ? null : previewTabId,
        });

        set({ tabs });
      },

      closeAllTabs: (projectId) => {
        const tabs = new Map(get().tabs);
        tabs.set(projectId, defaultTabState);
        set({ tabs });
      },

      setActiveTab: (projectId, fileId) => {
        const tabs = new Map(get().tabs);
        const state = tabs.get(projectId) ?? defaultTabState;
        tabs.set(projectId, { ...state, activeTabId: fileId });
        set({ tabs });
      },
}));
