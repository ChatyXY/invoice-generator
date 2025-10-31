import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: number;
  name: string;
  template: string;
  generatedDate: string;
  status: "completed" | "processing";
}

export default function Reports() {
  const [reports] = useState<Report[]>([
    { id: 1, name: "January Payroll", template: "Payroll Template", generatedDate: "2024-01-31", status: "completed" },
    { id: 2, name: "Q1 Summary", template: "Payroll Template", generatedDate: "2024-01-28", status: "completed" },
  ]);

  const [formData, setFormData] = useState({ template: "", name: "", period: "", data: "" });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Generate report:", formData);
    setFormData({ template: "", name: "", period: "", data: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Reports</h1>
        <p className="text-muted-foreground mt-1">Fill Excel templates and generate reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={formData.template} onValueChange={(val) => setFormData({ ...formData, template: val })}>
                  <SelectTrigger data-testid="select-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payroll">Payroll Template</SelectItem>
                    <SelectItem value="invoice">Invoice Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Report Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., January Payroll"
                  data-testid="input-report-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g., January 2024"
                  data-testid="input-period"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data (JSON or upload Excel)</Label>
                <Input
                  id="data"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  placeholder='[{"name": "John", "salary": 5000}]'
                  data-testid="input-data"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-generate-report">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-md hover-elevate"
                  data-testid={`report-${report.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {report.template} • {report.generatedDate}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {report.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log("Download report:", report)}
                    data-testid={`button-download-${report.id}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
