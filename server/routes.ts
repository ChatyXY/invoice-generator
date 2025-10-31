import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticateToken,
  isAdmin,
} from "./auth";
import { generateInvoicePDF } from "./services/pdf-generator";
import { fillExcelTemplate } from "./services/excel-generator";

// Setup file upload
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const templatesDir = path.join(uploadDir, "templates");
const invoicesDir = path.join(uploadDir, "invoices");
const reportsDir = path.join(uploadDir, "reports");

// Create upload directories
[uploadDir, templatesDir, invoicesDir, reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, templatesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls', '.html'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) and HTML files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ AUTH ROUTES ============
  
  // Login
  app.post("/api/auth/login", [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });

  // Refresh token
  app.post("/api/auth/refresh", async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await storage.getUser(payload.userId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const newPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(newPayload);

      return res.json({ accessToken });
    } catch (error) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
  });

  // ============ EMPLOYEE ROUTES ============
  
  app.get("/api/employees", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const employees = await storage.getEmployees();
    return res.json(employees);
  });

  app.get("/api/employees/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const employee = await storage.getEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json(employee);
  });

  app.post("/api/employees", [
    authenticateToken,
    isAdmin,
    body("nik").notEmpty(),
    body("name").notEmpty(),
    body("position").notEmpty(),
    body("salary").isInt({ min: 0 }),
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existing = await storage.getEmployeeByNik(req.body.nik);
    if (existing) {
      return res.status(400).json({ error: "NIK already exists" });
    }

    const employee = await storage.createEmployee(req.body);
    return res.status(201).json(employee);
  });

  app.put("/api/employees/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const employee = await storage.updateEmployee(req.params.id, req.body);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json(employee);
  });

  app.delete("/api/employees/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const deleted = await storage.deleteEmployee(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json({ message: "Employee deleted successfully" });
  });

  // ============ INVOICE ROUTES ============
  
  app.get("/api/invoices", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const invoices = await storage.getInvoices();
    return res.json(invoices);
  });

  app.get("/api/invoices/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const invoice = await storage.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    return res.json(invoice);
  });

  app.post("/api/invoices", [
    authenticateToken,
    isAdmin,
    body("invoiceNumber").notEmpty(),
    body("employeeId").notEmpty(),
    body("amount").isInt({ min: 0 }),
    body("items").isArray(),
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const invoice = await storage.createInvoice(req.body);
    return res.status(201).json(invoice);
  });

  // Generate PDF for invoice
  app.get("/api/invoices/:id/pdf", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const invoice = await storage.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const employee = await storage.getEmployee(invoice.employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    try {
      const pdfPath = await generateInvoicePDF(invoice, employee, invoicesDir);
      
      // Update invoice with PDF path
      await storage.updateInvoice(invoice.id, { pdfPath });

      // Send PDF file
      res.download(pdfPath, `invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      return res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  app.delete("/api/invoices/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const deleted = await storage.deleteInvoice(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    return res.json({ message: "Invoice deleted successfully" });
  });

  // ============ ATTENDANCE ROUTES ============
  
  app.get("/api/attendance", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const attendance = await storage.getAttendance();
    return res.json(attendance);
  });

  app.post("/api/attendance", [
    authenticateToken,
    isAdmin,
    body("employeeId").notEmpty(),
    body("date").isISO8601(),
    body("status").isIn(["present", "absent", "leave"]),
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const attendance = await storage.createAttendance(req.body);
    return res.status(201).json(attendance);
  });

  app.put("/api/attendance/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const attendance = await storage.updateAttendance(req.params.id, req.body);
    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    return res.json(attendance);
  });

  app.delete("/api/attendance/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const deleted = await storage.deleteAttendance(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    return res.json({ message: "Attendance record deleted successfully" });
  });

  // ============ TEMPLATE ROUTES ============
  
  app.get("/api/templates", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const templates = await storage.getTemplates();
    return res.json(templates);
  });

  app.post("/api/templates/upload", [authenticateToken, isAdmin, upload.single("file")], async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const { name, type, placeholders } = req.body;
    
    const template = await storage.createTemplate({
      name: name || req.file.originalname,
      filePath: req.file.path,
      type: type || "excel",
      placeholders: placeholders ? JSON.parse(placeholders) : [],
    });

    return res.status(201).json(template);
  });

  app.delete("/api/templates/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const template = await storage.getTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Delete file
    if (fs.existsSync(template.filePath)) {
      fs.unlinkSync(template.filePath);
    }

    const deleted = await storage.deleteTemplate(req.params.id);
    return res.json({ message: "Template deleted successfully" });
  });

  // ============ REPORT ROUTES ============
  
  app.get("/api/reports", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const reports = await storage.getReports();
    return res.json(reports);
  });

  app.post("/api/reports/fill", [
    authenticateToken,
    isAdmin,
    body("templateId").notEmpty(),
    body("name").notEmpty(),
    body("data").isObject(),
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { templateId, name, data } = req.body;
    const user = (req as any).user;

    const template = await storage.getTemplate(templateId);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    try {
      const outputPath = await fillExcelTemplate(template, data, reportsDir);
      
      const report = await storage.createReport({
        templateId,
        name,
        generatedPath: outputPath,
        meta: data,
        createdBy: user.id,
      });

      return res.status(201).json(report);
    } catch (error) {
      console.error("Report generation error:", error);
      return res.status(500).json({ error: "Failed to generate report" });
    }
  });

  app.get("/api/reports/:id/download", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const report = await storage.getReport(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (!fs.existsSync(report.generatedPath)) {
      return res.status(404).json({ error: "Report file not found" });
    }

    res.download(report.generatedPath, `${report.name}.xlsx`);
  });

  app.delete("/api/reports/:id", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    const report = await storage.getReport(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Delete file
    if (fs.existsSync(report.generatedPath)) {
      fs.unlinkSync(report.generatedPath);
    }

    const deleted = await storage.deleteReport(req.params.id);
    return res.json({ message: "Report deleted successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
