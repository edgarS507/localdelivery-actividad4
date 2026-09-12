import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  listAulaActivities: vi.fn().mockResolvedValue([]),
  createAulaActivity: vi.fn().mockImplementation(async (input) => ({ id: 91, createdAt: new Date(), updatedAt: new Date(), ...input })),
  updateAulaActivity: vi.fn().mockImplementation(async (ownerId, id, input) => ({ id, ownerId, ...input })),
  deleteAulaActivity: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./db", () => dbMocks);

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;
function contextFor(user: AuthenticatedUser | null): TrpcContext {
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

const user: AuthenticatedUser = { id: 77, openId: "aula-test-user", email: "aula@example.com", name: "Aula Test", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
const caller = () => appRouter.createCaller(contextFor(user));

describe("aulaTrack CRUD security", () => {
  it("rejects protected list access without an authenticated session", async () => {
    await expect(appRouter.createCaller(contextFor(null)).aulaTrack.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects invalid form payload before database processing", async () => {
    await expect(caller().aulaTrack.create({ title: "x", subject: "", status: "pending", dueDate: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(dbMocks.createAulaActivity).not.toHaveBeenCalled();
  });

  it("executes the protected read operation for the authenticated owner", async () => {
    const result = await caller().aulaTrack.list();
    expect(result).toEqual([]);
    expect(dbMocks.listAulaActivities).toHaveBeenCalledWith(user.id);
  });

  it("executes create, update and delete while keeping the owner id server-side", async () => {
    const created = await caller().aulaTrack.create({ title: "API REST para AulaTrack", subject: "Programación Web", status: "pending", dueDate: "2026-09-20", notes: "Validación de persistencia." });
    expect(created).toMatchObject({ id: 91, ownerId: user.id, title: "API REST para AulaTrack" });
    expect(dbMocks.createAulaActivity).toHaveBeenCalledWith({ ownerId: user.id, title: "API REST para AulaTrack", subject: "Programación Web", status: "pending", dueDate: "2026-09-20", notes: "Validación de persistencia." });

    const updated = await caller().aulaTrack.update({ id: 91, data: { status: "in_progress" } });
    expect(updated).toMatchObject({ id: 91, ownerId: user.id, status: "in_progress" });
    expect(dbMocks.updateAulaActivity).toHaveBeenCalledWith(user.id, 91, { status: "in_progress", dueDate: undefined, notes: undefined });

    const removed = await caller().aulaTrack.remove({ id: 91 });
    expect(removed).toEqual({ success: true });
    expect(dbMocks.deleteAulaActivity).toHaveBeenCalledWith(user.id, 91);
  });
});
