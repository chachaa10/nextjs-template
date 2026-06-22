import { isNotNull, isNull, type SQL } from "drizzle-orm";
import { type AnyPgColumn, timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().primaryKey().defaultRandom().notNull();

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"),
};

/**
 * Returns a SQL expression that checks if a record is not deleted.
 * Usage: where(isNotDeleted(table))
 * @param table The table to check.
 * @returns A SQL expression that checks if the record is not deleted.
 */
export function isNotDeleted(table: { deletedAt: AnyPgColumn }): SQL {
  return isNull(table.deletedAt);
}

/**
 * Returns a SQL expression that checks if a record is deleted.
 * Usage: where(isDeleted(table))
 * @param table The table to check.
 * @returns A SQL expression that checks if the record is deleted.
 */
export function isDeleted(table: { deletedAt: AnyPgColumn }): SQL {
  return isNotNull(table.deletedAt);
}
