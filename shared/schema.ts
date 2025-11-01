import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, timestamp, mysqlEnum, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for admin authentication)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: mysqlEnum("role", ["admin", "user"]).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// Employees table
export const employees = mysqlTable("employees", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  nik: varchar("nik", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  bankAccount: varchar("bank_account", { length: 100 }),
  salary: int("salary").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// Invoices table
export const invoices = mysqlTable("invoices", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
  employeeId: varchar("employee_id", { length: 36 }).notNull().references(() => employees.id, { onDelete: "cascade" }),
  amount: int("amount").notNull(),
  items: json("items").notNull().$type<Array<{ description: string; quantity: number; price: number }>>(),
  pdfPath: text("pdf_path"),
  status: mysqlEnum("status", ["pending", "paid", "overdue"]).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Attendance table
export const attendance = mysqlTable("attendance", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  employeeId: varchar("employee_id", { length: 36 }).notNull().references(() => employees.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  status: mysqlEnum("status", ["present", "absent", "leave"]).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Templates table
export const templates = mysqlTable("templates", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  filePath: text("file_path").notNull(),
  type: mysqlEnum("type", ["excel", "invoice_html"]).notNull(),
  placeholders: json("placeholders").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Reports table
export const reports = mysqlTable("reports", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  templateId: varchar("template_id", { length: 36 }).notNull().references(() => templates.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  generatedPath: text("generated_path").notNull(),
  meta: json("meta"),
  createdBy: varchar("created_by", { length: 36 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas and types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6),
}).omit({ passwordHash: true });

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export const updateInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  invoiceNumber: true,
  employeeId: true,
}).partial();

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
