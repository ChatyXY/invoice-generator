import { db } from "./db";
import { hashPassword } from "./auth";
import * as schema from "@shared/schema";
import fs from "fs";
import path from "path";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, "admin@company.test"),
    });

    if (!existingAdmin) {
      const passwordHash = await hashPassword("admin123");
      const [admin] = await db.insert(schema.users).values({
        name: "Admin User",
        email: "admin@company.test",
        passwordHash,
        role: "admin",
      }).returning();
      console.log("✅ Admin user created:", admin.email);
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Create sample employees
    const existingEmployees = await db.query.employees.findMany();
    
    if (existingEmployees.length === 0) {
      const employees = await db.insert(schema.employees).values([
        {
          nik: "EMP001",
          name: "John Doe",
          position: "Software Engineer",
          salary: 50000,
          bankAccount: "1234567890",
        },
        {
          nik: "EMP002",
          name: "Jane Smith",
          position: "Product Designer",
          salary: 45000,
          bankAccount: "0987654321",
        },
        {
          nik: "EMP003",
          name: "Bob Johnson",
          position: "Project Manager",
          salary: 60000,
          bankAccount: "5555555555",
        },
      ]).returning();
      console.log(`✅ Created ${employees.length} sample employees`);
    } else {
      console.log(`ℹ️  ${existingEmployees.length} employees already exist`);
    }

    // Create sample Excel template
    const existingTemplates = await db.query.templates.findMany();
    
    if (existingTemplates.length === 0) {
      const uploadsDir = process.env.UPLOAD_DIR || "./uploads";
      const templatesDir = path.join(uploadsDir, "templates");
      
      if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
      }

      // Create a simple sample template file
      const sampleTemplatePath = path.join(templatesDir, "payroll-template-sample.xlsx");
      
      // Create placeholder - in real implementation, you'd copy an actual Excel template
      fs.writeFileSync(sampleTemplatePath, "Sample Excel Template Placeholder");

      await db.insert(schema.templates).values({
        name: "Payroll Template",
        filePath: sampleTemplatePath,
        type: "excel",
        placeholders: ["name", "period", "salary", "deductions", "net_pay"],
      });
      console.log("✅ Created sample Excel template");
    } else {
      console.log(`ℹ️  ${existingTemplates.length} templates already exist`);
    }

    console.log("✅ Database seeding completed!");
    console.log("\n📝 Default Login Credentials:");
    console.log("   Email: admin@company.test");
    console.log("   Password: admin123");
    console.log("\n⚠️  Please change the password after first login!\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
