import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: number;
  name: string;
  type: "excel" | "invoice_html";
  placeholders: string[];
  uploadDate: string;
}

export default function Templates() {
  const [templates] = useState<Template[]>([
    { id: 1, name: "Payroll Template", type: "excel", placeholders: ["name", "period", "salary", "deductions"], uploadDate: "2024-01-15" },
    { id: 2, name: "Invoice HTML", type: "invoice_html", placeholders: ["company_name", "invoice_number", "date", "amount"], uploadDate: "2024-01-20" },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Templates</h1>
        <p className="text-muted-foreground mt-1">Manage Excel and invoice templates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-md p-8 text-center hover-elevate cursor-pointer">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your Excel or HTML template here
            </p>
            <label htmlFor="file-upload">
              <Button variant="outline" asChild data-testid="button-upload">
                <span>
                  Choose File
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.html"
                    onChange={handleFileUpload}
                  />
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover-elevate" data-testid={`template-${template.id}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <div className="flex items-center gap-3">
                {template.type === "excel" ? (
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                ) : (
                  <FileText className="h-8 w-8 text-blue-600" />
                )}
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploaded {template.uploadDate}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log("Delete template:", template)}
                data-testid={`button-delete-${template.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Placeholders:</p>
                <div className="flex flex-wrap gap-2">
                  {template.placeholders.map((placeholder) => (
                    <Badge key={placeholder} variant="secondary" className="font-mono text-xs">
                      {`{{${placeholder}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
