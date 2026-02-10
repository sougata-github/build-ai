import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    id: v.string(),
    name: v.string(),
    userId: v.string(),
    importStatus: v.optional(
      v.union(
        v.literal("importing"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    exportStatus: v.optional(
      v.union(
        v.literal("exporting"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled")
      )
    ),
    exportRepoUrl: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_uuid", ["id"])
    .index("by_user", ["userId"])
    .index("by_user_updatedAt", ["userId", "updatedAt"]),

  files: defineTable({
    id: v.string(),
    projectId: v.string(), //the uuid of the project
    parentId: v.optional(v.string()),
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("folder")),
    content: v.optional(v.string()), //text files only
    storageId: v.optional(v.id("_storage")),
    updatedAt: v.number(),
  })
    .index("by_uuid", ["id"])
    .index("by_project", ["projectId"])
    .index("by_project_parent", ["projectId", "parentId"])
    .index("by_parent", ["parentId"])
    .index("by_project_updatedAt", ["projectId", "updatedAt"]),
});
