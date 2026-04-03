import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import FormInput from "../components/FormInput";
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
    <div className="space-y-4">
      <form onSubmit={submitCategory} className="card grid gap-3 p-4 md:grid-cols-[1fr_auto]">
        <FormInput label="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded-xl bg-brand-600 px-4 py-2 text-white self-end">{editing ? "Update" : "Add"}</button>
      </form>

      <DataTable
        columns={[{ key: "name", label: "Category Name" }]}
        data={rows}
        actions={(row) => (
          <button
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
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
