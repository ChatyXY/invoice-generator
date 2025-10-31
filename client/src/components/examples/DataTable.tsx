import DataTable from '../DataTable';

export default function DataTableExample() {
  const sampleData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer" },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={sampleData}
        onAdd={() => console.log("Add clicked")}
        onEdit={(item) => console.log("Edit:", item)}
        onDelete={(item) => console.log("Delete:", item)}
      />
    </div>
  );
}
