/* eslint-disable react-hooks/purity */
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex-helpers/react/cache/hooks";
import { Doc, Id } from "@convex/_generated/dataModel";
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

export function useProjectById(id: Doc<"projects">["id"]) {
  return useQuery(api.projects.getById, { id });
}

export function useRenameProject(projectId: Doc<"projects">["id"]) {
  return useMutation(api.projects.rename).withOptimisticUpdate(
    (localStore, args) => {
      const existingProject = localStore.getQuery(api.projects.getById, {
        id: args.id,
      });

      if (existingProject !== undefined && existingProject !== null) {
        const now = Date.now();

        localStore.setQuery(
          api.projects.getById,
          { id: projectId },
          { ...existingProject, name: args.name, updatedAt: now }
        );
      }

      const existingProjects = localStore.getQuery(api.projects.get);

      if (existingProjects !== undefined) {
        localStore.setQuery(api.projects.get, {}, [
          ...existingProjects.map((project) =>
            project.id === args.id
              ? { ...project, name: args.name, updatedAt: Date.now() }
              : project
          ),
        ]);
      }
    }
  );
}
