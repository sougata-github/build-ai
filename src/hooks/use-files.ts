import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache/hooks";

export const useCreateFile = () => {
  return useMutation(api.files.createFile);
};

export const useCreateFolder = () => {
  return useMutation(api.files.createFolder);
};

export const useFolderContents = ({
  projectId,
  parentId,
  enabled,
}: {
  projectId: Doc<"projects">["id"];
  parentId?: Doc<"files">["id"];
  enabled?: boolean;
}) => {
  return useQuery(
    api.files.getFolderContents,
    enabled ? { projectId, parentId } : "skip"
  );
};

export const useRenameFile = () => {
  return useMutation(api.files.renameFile);
};

export const useDeleteFile = () => {
  return useMutation(api.files.deleteFile);
};

export const useFile = (fileId: Doc<"files">["id"] | null) => {
  return useQuery(api.files.getFile, fileId ? { id: fileId } : "skip");
};

export const useFilePath = (fileId: Doc<"files">["id"] | null) => {
  return useQuery(api.files.getFilePath, fileId ? { id: fileId } : "skip");
};

export const useUpdateFile = () => {
  return useMutation(api.files.updateFile);
};
