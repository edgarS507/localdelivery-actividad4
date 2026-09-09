import { COOKIE_NAME } from "@shared/const";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createAulaActivity, deleteAulaActivity, listAulaActivities, updateAulaActivity } from "./db";

const activityInput = z.object({
  title: z.string().trim().min(3).max(160),
  subject: z.string().trim().min(2).max(120),
  status: z.enum(["pending", "in_progress", "submitted"]).default("pending"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  aulaTrack: router({
    list: protectedProcedure.query(({ ctx }) => listAulaActivities(ctx.user.id)),
    create: protectedProcedure.input(activityInput).mutation(({ ctx, input }) => createAulaActivity({ ownerId: ctx.user.id, ...input, dueDate: input.dueDate || null, notes: input.notes || null })),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), data: activityInput.partial() })).mutation(({ ctx, input }) => updateAulaActivity(ctx.user.id, input.id, { ...input.data, dueDate: input.data.dueDate || undefined, notes: input.data.notes || undefined })),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => deleteAulaActivity(ctx.user.id, input.id)),
  }),
});

export type AppRouter = typeof appRouter;
