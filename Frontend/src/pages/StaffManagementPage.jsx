import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import { authService } from "../services/authService";
import { emailRegex, validatePhone, validateRequired } from "../utils/validators";

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", email: "", contactNumber: "", password: "", status: "active" });

  async function load() {
    const { data } = await authService.getAllStaff();
    setStaff(data || []);
  }

  useEffect(() => {
    load().catch(() => toast.error("Failed to load staff"));
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await authService.updateStaff({
          id: String(form.id),
          name: form.name,
          contactNumber: form.contactNumber,
          status: form.status,
          ...(form.password ? { password: form.password } : {}),
        });
        toast.success("Staff updated");
      } else {
        if (!validateRequired(form.name) || !emailRegex.test(form.email) || !validatePhone(form.contactNumber) || !validateRequired(form.password)) {
          toast.error("Fill all staff fields correctly");
          return;
        }
        await authService.addStaff({
          name: form.name,
          email: form.email,
          contactNumber: form.contactNumber,
          password: form.password,
        });
        toast.success("Staff added");
      }
      setForm({ id: "", name: "", email: "", contactNumber: "", password: "", status: "active" });
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" subtitle="Add and manage Brew Haven staff accounts" />
      <form onSubmit={submit} className="cafe-card grid gap-4 p-5 md:grid-cols-2">
        <FormInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FormInput label="Email" value={form.email} disabled={Boolean(form.id)} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormInput label="Contact" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        <FormInput
          label={form.id ? "New Password (optional)" : "Password"}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {form.id && (
          <select className="cafe-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        )}
        <button type="submit" className="cafe-btn md:col-span-2">
          {form.id ? "Update Staff" : "Add Staff"}
        </button>
      </form>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "contactNumber", label: "Contact" },
          { key: "status", label: "Status" },
        ]}
        data={staff}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              className="cafe-btn-secondary px-2 py-1 text-xs"
              onClick={() => setForm({ id: row.id, name: row.name, email: row.email, contactNumber: row.contactNumber, password: "", status: row.status })}
            >
              Edit
            </button>
            <button
              className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600"
              onClick={async () => {
                if (!window.confirm(`Remove staff ${row.name}?`)) return;
                await authService.deleteStaff(row.id);
                toast.success("Deleted");
                load();
              }}
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}
