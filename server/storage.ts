import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User, InsertUser,
  Employee, InsertEmployee,
  Invoice, InsertInvoice, UpdateInvoice,
  Attendance, InsertAttendance,
  Template, InsertTemplate,
  Report, InsertReport
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { passwordHash: string }): Promise<User>;
  
  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeeByNik(nik: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  
  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: UpdateInvoice): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;
  
  // Attendance
  getAttendance(): Promise<Attendance[]>;
  getAttendanceByEmployee(employeeId: string): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  deleteAttendance(id: string): Promise<boolean>;
  
  // Templates
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  deleteTemplate(id: string): Promise<boolean>;
  
  // Reports
  getReports(): Promise<Report[]>;
  getReport(id: string): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  deleteReport(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  }

  async createUser(user: InsertUser & { passwordHash: string }): Promise<User> {
    const { password, ...userData } = user as any;
    const [newUser] = await db.insert(schema.users).values(userData).returning();
    return newUser;
  }

  // Employees
  async getEmployees(): Promise<Employee[]> {
    return db.select().from(schema.employees).orderBy(desc(schema.employees.createdAt));
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(schema.employees).where(eq(schema.employees.id, id));
    return employee;
  }

  async getEmployeeByNik(nik: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(schema.employees).where(eq(schema.employees.nik, nik));
    return employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(schema.employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const [updated] = await db.update(schema.employees)
      .set({ ...employee, updatedAt: new Date() })
      .where(eq(schema.employees.id, id))
      .returning();
    return updated;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(schema.employees).where(eq(schema.employees.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return db.select().from(schema.invoices).orderBy(desc(schema.invoices.createdAt));
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id));
    return invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(schema.invoices).values(invoice).returning();
    return newInvoice;
  }

  async updateInvoice(id: string, invoice: UpdateInvoice): Promise<Invoice | undefined> {
    const [updated] = await db.update(schema.invoices)
      .set(invoice)
      .where(eq(schema.invoices.id, id))
      .returning();
    return updated;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const result = await db.delete(schema.invoices).where(eq(schema.invoices.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Attendance
  async getAttendance(): Promise<Attendance[]> {
    return db.select().from(schema.attendance).orderBy(desc(schema.attendance.date));
  }

  async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    return db.select().from(schema.attendance)
      .where(eq(schema.attendance.employeeId, employeeId))
      .orderBy(desc(schema.attendance.date));
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(schema.attendance).values(attendance).returning();
    return newAttendance;
  }

  async updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const [updated] = await db.update(schema.attendance)
      .set(attendance)
      .where(eq(schema.attendance.id, id))
      .returning();
    return updated;
  }

  async deleteAttendance(id: string): Promise<boolean> {
    const result = await db.delete(schema.attendance).where(eq(schema.attendance.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Templates
  async getTemplates(): Promise<Template[]> {
    return db.select().from(schema.templates).orderBy(desc(schema.templates.createdAt));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(schema.templates).where(eq(schema.templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(schema.templates).values(template).returning();
    return newTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await db.delete(schema.templates).where(eq(schema.templates.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Reports
  async getReports(): Promise<Report[]> {
    return db.select().from(schema.reports).orderBy(desc(schema.reports.createdAt));
  }

  async getReport(id: string): Promise<Report | undefined> {
    const [report] = await db.select().from(schema.reports).where(eq(schema.reports.id, id));
    return report;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(schema.reports).values(report).returning();
    return newReport;
  }

  async deleteReport(id: string): Promise<boolean> {
    const result = await db.delete(schema.reports).where(eq(schema.reports.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DbStorage();
