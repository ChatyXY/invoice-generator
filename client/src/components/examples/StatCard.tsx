import StatCard from '../StatCard';
import { Users } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatCard title="Total Employees" value={234} icon={Users} trend={{ value: 12, isPositive: true }} />
      <StatCard title="Active Invoices" value={18} icon={Users} />
    </div>
  );
}
