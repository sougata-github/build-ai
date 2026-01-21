import { v } from "convex/values";
import { verifyAuth } from "./auth";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const projectId = await ctx.db.insert("projects", {
      id: crypto.randomUUID(),
      name: args.name,
      userId: identity.subject,
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await verifyAuth(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const getPartial = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_user_updatedAt", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", args.id))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    return project;
  },
});

export const rename = mutation({
  args: { id: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db
      .query("projects")
      .withIndex("by_uuid", (q) => q.eq("id", args.id))
      .first();

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== identity.subject) {
      throw new Error("Unauthorized access to project");
    }

    await ctx.db.patch(project._id, { name: args.name, updatedAt: Date.now() });
  },
});
