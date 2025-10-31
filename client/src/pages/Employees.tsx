import { useState } from "react";
import DataTable from "@/components/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: number;
  nik: string;
  name: string;
  position: string;
  salary: number;
  bankAccount: string;
  status: "active" | "inactive";
}

export default function Employees() {
  const [employees] = useState<Employee[]>([
    { id: 1, nik: "EMP001", name: "John Doe", position: "Developer", salary: 50000, bankAccount: "1234567890", status: "active" },
    { id: 2, nik: "EMP002", name: "Jane Smith", position: "Designer", salary: 45000, bankAccount: "0987654321", status: "active" },
    { id: 3, nik: "EMP003", name: "Bob Johnson", position: "Manager", salary: 60000, bankAccount: "5555555555", status: "active" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ nik: "", name: "", position: "", salary: "", bankAccount: "" });

  const columns = [
    { key: "nik", label: "NIK" },
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    {
      key: "salary",
      label: "Salary",
      render: (emp: Employee) => `$${emp.salary.toLocaleString()}`,
    },
    { key: "bankAccount", label: "Bank Account" },
    {
      key: "status",
      label: "Status",
      render: (emp: Employee) => (
        <Badge variant={emp.status === "active" ? "default" : "secondary"}>
          {emp.status}
        </Badge>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Employee form submitted:", formData);
    setIsDialogOpen(false);
    setFormData({ nik: "", name: "", position: "", salary: "", bankAccount: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Employees</h1>
        <p className="text-muted-foreground mt-1">Manage employee records and information</p>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        onAdd={() => setIsDialogOpen(true)}
        onEdit={(emp) => {
          console.log("Edit employee:", emp);
          setIsDialogOpen(true);
        }}
        onDelete={(emp) => console.log("Delete employee:", emp)}
        searchPlaceholder="Search employees..."
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  required
                  data-testid="input-nik"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                  data-testid="input-position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  required
                  data-testid="input-salary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Input
                  id="bankAccount"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  required
                  data-testid="input-bank-account"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save">Save Employee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
