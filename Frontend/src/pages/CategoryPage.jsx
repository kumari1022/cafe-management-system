import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import { categoryService } from "../services/categoryService";

export default function CategoryPage() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  async function fetchRows() {
    const { data } = await categoryService.getAll();
    setRows(data || []);
  }

  useEffect(() => {
    fetchRows();
  }, []);

  async function submitCategory(e) {
    e.preventDefault();
    try {
      if (!name.trim()) return toast.error("Category name required");
      if (editing) {
        await categoryService.update({ id: String(editing.id), name });
        toast.success("Category updated");
      } else {
        await categoryService.add({ name });
        toast.success("Category added");
      }
      setName("");
      setEditing(null);
      fetchRows();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Category action failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" subtitle="Organize your menu sections" />
      <form onSubmit={submitCategory} className="cafe-card grid gap-4 p-5 md:grid-cols-[1fr_auto]">
        <FormInput label="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="cafe-btn self-end px-6">
          {editing ? "Update" : "Add"}
        </button>
      </form>

      <DataTable
        columns={[{ key: "name", label: "Category Name" }]}
        data={rows}
        actions={(row) => (
          <button
            className="cafe-btn-secondary px-3 py-1 text-xs"
            onClick={() => {
              setEditing(row);
              setName(row.name);
            }}
          >
            Edit
          </button>
        )}
      />
    </div>
  );
}
