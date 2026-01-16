/* eslint-disable react-hooks/purity */
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex-helpers/react/cache/hooks";
import { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";

export function useProjects() {
  return useQuery(api.projects.get);
}

export function useProjectsPartial() {
  return usePaginatedQuery(api.projects.getPartial, {}, { initialNumItems: 5 });
}

export const useCreateProject = () => {
  const { userId } = useAuth();

  return useMutation(api.projects.create).withOptimisticUpdate(
    (localStore, args) => {
      const existingProjects = localStore.getQuery(api.projects.get);

      if (existingProjects !== undefined) {
        const now = Date.now();

        //simulate a new project
        const newProject = {
          _id: crypto.randomUUID() as Id<"projects">,
          _creationTime: now,
          id: crypto.randomUUID(),
          name: args.name,
          userId: userId ?? "anonymous",
          updatedAt: now,
        };

        localStore.setQuery(api.projects.get, {}, [
          newProject,
          ...existingProjects,
        ]);
      }
    }
  );
};
