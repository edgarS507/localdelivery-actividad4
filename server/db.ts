import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { aulaActivities, InsertAulaActivity, InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listAulaActivities(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aulaActivities).where(eq(aulaActivities.ownerId, ownerId)).orderBy(desc(aulaActivities.updatedAt));
}

export async function createAulaActivity(input: Omit<InsertAulaActivity, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(aulaActivities).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function updateAulaActivity(ownerId: number, id: number, input: Partial<Pick<InsertAulaActivity, "title" | "subject" | "status" | "dueDate" | "notes">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(aulaActivities).set({ ...input, updatedAt: new Date() }).where(and(eq(aulaActivities.id, id), eq(aulaActivities.ownerId, ownerId)));
  const rows = await db.select().from(aulaActivities).where(and(eq(aulaActivities.id, id), eq(aulaActivities.ownerId, ownerId))).limit(1);
  return rows[0];
}

export async function deleteAulaActivity(ownerId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(aulaActivities).where(and(eq(aulaActivities.id, id), eq(aulaActivities.ownerId, ownerId)));
  return { success: true } as const;
}
