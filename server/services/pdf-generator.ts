import puppeteer from "puppeteer";
import path from "path";
import type { Invoice, Employee } from "@shared/schema";

export async function generateInvoicePDF(
  invoice: Invoice,
  employee: Employee,
  outputDir: string
): Promise<string> {
  const filename = `invoice-${invoice.invoiceNumber}-${Date.now()}.pdf`;
  const outputPath = path.join(outputDir, filename);

  // Parse items
  const items = invoice.items as any[];

  // Generate HTML template
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 10px;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: bold;
      margin-top: 20px;
    }
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .info-block {
      width: 48%;
    }
    .info-block h3 {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .info-block p {
      margin: 5px 0;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8fafc;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 12px;
      color: #666;
    }
    .text-right {
      text-align: right;
    }
    .total-section {
      margin-top: 30px;
      text-align: right;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      margin: 10px 0;
      font-size: 16px;
    }
    .total-row.grand {
      font-size: 20px;
      font-weight: bold;
      color: #3b82f6;
      border-top: 2px solid #3b82f6;
      padding-top: 15px;
      margin-top: 15px;
    }
    .total-label {
      margin-right: 40px;
      min-width: 150px;
    }
    .footer {
      margin-top: 60px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">COMPANY NAME</div>
    <p>123 Business Street, City, State 12345</p>
    <p>Phone: (555) 123-4567 | Email: contact@company.com</p>
    <div class="invoice-title">INVOICE</div>
  </div>

  <div class="info-section" style="display: block;">
    <div class="info-block" style="width: 100%; margin-bottom: 20px;">
      <h3>Invoice Details</h3>
      <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
      <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
    </div>

    <div class="info-block" style="width: 100%;">
      <h3>Bill To</h3>
      <p><strong>${employee.name}</strong></p>
      <p>NIK: ${employee.nik}</p>
      <p>Position: ${employee.position}</p>
      ${employee.bankAccount ? `<p>Bank Account: ${employee.bankAccount}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-right">Quantity</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.description || 'Service'}</td>
          <td class="text-right">${item.quantity || 1}</td>
          <td class="text-right">$${(item.price || 0).toLocaleString()}</td>
          <td class="text-right">$${((item.quantity || 1) * (item.price || 0)).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-row grand">
      <div class="total-label">TOTAL AMOUNT:</div>
      <div>$${invoice.amount.toLocaleString()}</div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Please make payment within 30 days of receiving this invoice.</p>
  </div>
</body>
</html>
  `;

  // Launch puppeteer and generate PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px',
    },
  });

  await browser.close();

  return outputPath;
}
