import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function contextFor(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const user: AuthenticatedUser = {
  id: 77,
  openId: "aula-test-user",
  email: "aula@example.com",
  name: "Aula Test",
  loginMethod: "test",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("aulaTrack CRUD security", () => {
  it("rejects protected list access without an authenticated session", async () => {
    const caller = appRouter.createCaller(contextFor(null));
    await expect(caller.aulaTrack.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects invalid form payload before database processing", async () => {
    const caller = appRouter.createCaller(contextFor(user));
    await expect(caller.aulaTrack.create({ title: "x", subject: "", status: "pending", dueDate: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns an array for an authenticated activity list", async () => {
    const caller = appRouter.createCaller(contextFor(user));
    const result = await caller.aulaTrack.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
