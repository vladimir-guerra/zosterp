import { uuid, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);
export const id = uuid().primaryKey().defaultRandom();
export const full_timestamp = {
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
};
export const deleted_at = timestamp();
