import { useState } from "react";
import DataTable from "@/components/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText } from "lucide-react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  employeeName: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  date: string;
}

export default function Invoices() {
  const [invoices] = useState<Invoice[]>([
    { id: 1, invoiceNumber: "INV-001", employeeName: "John Doe", amount: 5000, status: "paid", date: "2024-01-15" },
    { id: 2, invoiceNumber: "INV-002", employeeName: "Jane Smith", amount: 4500, status: "pending", date: "2024-01-20" },
    { id: 3, invoiceNumber: "INV-003", employeeName: "Bob Johnson", amount: 6000, status: "paid", date: "2024-01-25" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ employee: "", amount: "", items: "" });

  const columns = [
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "employeeName", label: "Employee" },
    {
      key: "amount",
      label: "Amount",
      render: (inv: Invoice) => `$${inv.amount.toLocaleString()}`,
    },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (inv: Invoice) => (
        <Badge
          variant={
            inv.status === "paid" ? "default" :
            inv.status === "pending" ? "secondary" :
            "destructive"
          }
        >
          {inv.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "PDF",
      render: (inv: Invoice) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log("Download PDF:", inv)}
          data-testid={`button-download-${inv.id}`}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Generate invoice:", formData);
    setIsDialogOpen(false);
    setFormData({ employee: "", amount: "", items: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Invoices</h1>
        <p className="text-muted-foreground mt-1">Generate and manage PDF invoices</p>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        onAdd={() => setIsDialogOpen(true)}
        onEdit={(inv) => {
          console.log("Edit invoice:", inv);
          setIsDialogOpen(true);
        }}
        onDelete={(inv) => console.log("Delete invoice:", inv)}
        searchPlaceholder="Search invoices..."
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Invoice
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select value={formData.employee} onValueChange={(val) => setFormData({ ...formData, employee: val })}>
                  <SelectTrigger data-testid="select-employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="bob">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  data-testid="input-amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Items (JSON format)</Label>
                <Input
                  id="items"
                  placeholder='[{"desc": "Service", "qty": 1, "price": 5000}]'
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  data-testid="input-items"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" data-testid="button-generate">Generate PDF</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
