import { sql } from "drizzle-orm";
import {
  date,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const appointments = pgTable(
  "realty_appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("userId").notNull().default("atb-owner"),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    appointmentType: text("appointment_type").notNull(),
    appointmentDate: date("appointment_date", { mode: "string" }).notNull(),
    appointmentTime: time("appointment_time").notNull(),
    message: text("message").notNull().default(""),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    activeSlotUnique: uniqueIndex("realty_appointments_active_slot_unique")
      .on(table.userId, table.appointmentDate, table.appointmentTime)
      .where(sql`${table.status} in ('pending', 'confirmed')`),
  }),
);
