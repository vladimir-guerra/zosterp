import { eq } from "drizzle-orm";
import { pgTable, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";
import { languageList } from "@repo/locales";
import {
  insertUserSchema,
  loginSchema,
  type LoginInput,
  type InsertUserInput,
} from "@repo/schemas";
import { db, deleted_at, full_timestamp, id } from "./base.js";
import { genSalt, hash, compare } from "bcrypt-ts";

const languageEnum = pgEnum("language_type", languageList);

export const usersTable = pgTable("users", {
  id,
  name: varchar({ length: 255 }).notNull(),
  surname: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  language: languageEnum().default("en"),
  has_2fa: boolean().default(false),
  password_hash: varchar({ length: 255 }).notNull(),
  ...full_timestamp,
  deleted_at,
});

export async function createUser(userData: InsertUserInput) {
  const result = insertUserSchema.safeParse(userData);
  if (result.error) throw Error(result.error.message);
  const { password, ...parsedData } = result.data;
  const salt = await genSalt();
  const password_hash = await hash(password, salt);
  const newUser = await db
    .insert(usersTable)
    .values({ password_hash, ...parsedData })
    .returning();
  return newUser;
}

export async function login(loginData: LoginInput) {
  const result = loginSchema.safeParse(loginData);
  if (result.error) throw Error("INTERNAL SERVER ERROR");
  const { email, password } = result.data;
  const [foundUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!foundUser) throw Error("INVALID_CREDENTIALS");
  const is_loggued = await compare(password, foundUser.password_hash);
  if (!is_loggued) throw Error("INVALID_CREDENTIALS");
  return foundUser;
}
