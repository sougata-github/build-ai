import { v } from "convex/values";
import { verifyAuth } from "./auth";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getFiles = query({
  args: {
    projectId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", args.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    return await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getFile = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const file = await ctx.db
      .query("files")
      .withIndex("by_uuid", (q) => q.eq("id", args.id))
      .first();

    if (!file) {
      throw new Error("File not found");
    }

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", file.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    return file;
  },
});

export const getFolderContents = query({
  args: {
    projectId: v.string(),
    parentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", args.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId)
      )
      .collect();

    //sort folders first, then files, alphabetically within each group
    return files.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;

      if (a.type === "file" && b.type === "folder") return 1;

      return a.name.localeCompare(b.name);
    });
  },
});

export const createFile = mutation({
  args: {
    projectId: v.string(),
    parentId: v.optional(v.string()),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", args.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId)
      )
      .collect();

    //check if same name file or folder already exists
    const existing = files.find(
      (file) => file.name === args.name && file.type === "file"
    );

    if (existing) {
      throw new Error("File with this name already exists");
    }

    const now = Date.now();

    await ctx.db.insert("files", {
      id: crypto.randomUUID(),
      projectId: args.projectId,
      parentId: args.parentId,
      name: args.name,
      content: args.content,
      type: "file",
      updatedAt: now,
    });

    await ctx.db.patch(project._id, {
      updatedAt: now,
    });
  },
});

export const createFolder = mutation({
  args: {
    projectId: v.string(),
    parentId: v.optional(v.string()),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", args.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    const folders = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId)
      )
      .collect();

    //check if same name file or folder already exists
    const existing = folders.find(
      (folder) => folder.name === args.name && folder.type === "folder"
    );

    if (existing) {
      throw new Error("Folder with this name already exists");
    }

    const now = Date.now();
    await ctx.db.insert("files", {
      id: crypto.randomUUID(),
      projectId: args.projectId,
      parentId: args.parentId,
      name: args.name,
      type: "folder",
      updatedAt: now,
    });

    await ctx.db.patch(project._id, {
      updatedAt: now,
    });
  },
});

export const renameFile = mutation({
  args: { id: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const file = await ctx.db
      .query("files")
      .withIndex("by_uuid", (q) => q.eq("id", args.id))
      .first();

    if (!file) {
      throw new Error("File not found");
    }

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", file.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    //check if new name is being used by another file or folder
    const siblings = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", file.projectId).eq("parentId", file.parentId)
      )
      .collect();

    //check for both files and folders
    const existing = siblings.find(
      (sibling) =>
        sibling.name === args.name &&
        sibling.type === file.type &&
        sibling.id !== file.id
    );

    if (existing) {
      throw new Error(`A ${file.type} with this name already exists`);
    }

    const now = Date.now();

    //rename file/folder
    await ctx.db.patch(file._id, { name: args.name, updatedAt: now });

    await ctx.db.patch(project._id, {
      updatedAt: now,
    });
  },
});

export const deleteFile = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const fileToDelete = await ctx.db
      .query("files")
      .withIndex("by_uuid", (q) => q.eq("id", args.id))
      .first();

    if (!fileToDelete) {
      throw new Error("File not found");
    }

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", fileToDelete.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    //delete nested files and folders in a folder
    const deleteRecursive = async (fileId: Id<"files">) => {
      const file = await ctx.db.get(fileId);
      if (!file) return;

      if (file.type === "folder") {
        //get nested files and folders
        const children = await ctx.db
          .query("files")
          .withIndex("by_project_parent", (q) =>
            q.eq("projectId", file.projectId).eq("parentId", file.id)
          )
          .collect();

        //nested child can be a folder
        for (const child of children) {
          await deleteRecursive(child._id);
        }
      }

      //delete storage file if it exists
      if (file.storageId) {
        await ctx.storage.delete(file.storageId);
      }

      //delete file or folder
      await ctx.db.delete(fileId);
    };

    await deleteRecursive(fileToDelete._id);

    await ctx.db.patch(project._id, {
      updatedAt: Date.now(),
    });
  },
});

export const updateFile = mutation({
  args: {
    id: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const file = await ctx.db
      .query("files")
      .withIndex("by_uuid", (q) => q.eq("id", args.id))
      .first();

    if (!file) {
      throw new Error("File not found");
    }

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", file.projectId))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    const now = Date.now();

    await ctx.db.patch(file._id, {
      content: args.content,
      updatedAt: now,
    });

    await ctx.db.patch(project._id, {
      updatedAt: now,
    });
  },
});
