import { useState } from "react";
import DataTable from "@/components/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";

interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: string;
  status: "present" | "absent" | "leave";
  note?: string;
}

export default function Attendance() {
  const [records] = useState<AttendanceRecord[]>([
    { id: 1, employeeName: "John Doe", date: "2024-01-30", status: "present" },
    { id: 2, employeeName: "Jane Smith", date: "2024-01-30", status: "present" },
    { id: 3, employeeName: "Bob Johnson", date: "2024-01-30", status: "leave", note: "Sick leave" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({ employee: "", status: "", note: "" });

  const columns = [
    { key: "employeeName", label: "Employee" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (rec: AttendanceRecord) => (
        <Badge
          variant={
            rec.status === "present" ? "default" :
            rec.status === "leave" ? "secondary" :
            "destructive"
          }
        >
          {rec.status}
        </Badge>
      ),
    },
    { key: "note", label: "Note" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attendance record:", { ...formData, date: selectedDate });
    setIsDialogOpen(false);
    setFormData({ employee: "", status: "", note: "" });
    setSelectedDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track employee attendance records</p>
        </div>
        <Button variant="outline" onClick={() => console.log("Import from Excel")} data-testid="button-import">
          <Upload className="h-4 w-4 mr-2" />
          Import Excel
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={records}
        onAdd={() => setIsDialogOpen(true)}
        onEdit={(rec) => {
          console.log("Edit record:", rec);
          setIsDialogOpen(true);
        }}
        onDelete={(rec) => console.log("Delete record:", rec)}
        searchPlaceholder="Search attendance..."
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attendance Record</DialogTitle>
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
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-date-picker">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save">Save Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
