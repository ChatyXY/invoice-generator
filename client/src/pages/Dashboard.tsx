import StatCard from "@/components/StatCard";
import { Users, FileText, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const recentActivity = [
    { id: 1, user: "John Doe", action: "created invoice #1024", time: "2 hours ago" },
    { id: 2, user: "Jane Smith", action: "marked attendance", time: "4 hours ago" },
    { id: 3, user: "Bob Johnson", action: "uploaded template", time: "5 hours ago" },
    { id: 4, user: "Alice Brown", action: "generated report", time: "1 day ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={234}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Invoices"
          value={18}
          icon={FileText}
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          title="Attendance Rate"
          value="94%"
          icon={Calendar}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Active Templates"
          value={8}
          icon={CheckCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                  data-testid={`activity-${activity.id}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Invoices Generated</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reports Created This Month</span>
                <span className="font-semibold">87</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Attendance</span>
                <span className="font-semibold">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Employees</span>
                <span className="font-semibold">234 / 250</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
