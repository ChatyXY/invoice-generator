import ExcelJS from "exceljs";
import path from "path";
import type { Template } from "@shared/schema";

export async function fillExcelTemplate(
  template: Template,
  data: Record<string, any>,
  outputDir: string
): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(template.filePath);

  // Iterate through all worksheets
  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (cell.value && typeof cell.value === 'string') {
          let cellValue = cell.value;
          
          // Replace placeholders like {{name}}, {{period}}, etc.
          Object.keys(data).forEach((key) => {
            const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            cellValue = cellValue.replace(placeholder, String(data[key]));
          });
          
          cell.value = cellValue;
        }
      });
    });
  });

  const filename = `report-${Date.now()}.xlsx`;
  const outputPath = path.join(outputDir, filename);

  await workbook.xlsx.writeFile(outputPath);

  return outputPath;
}
