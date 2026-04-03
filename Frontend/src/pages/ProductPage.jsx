import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import FormInput from "../components/FormInput";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { formatCurrency } from "../utils/formatters";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [form, setForm] = useState({ id: "", name: "", description: "", price: "", categoryId: "" });

  async function load() {
    const [p, c] = await Promise.all([productService.getAll(), categoryService.getAll()]);
    setProducts(p.data || []);
    setCategories(c.data || []);
  }

  useEffect(() => {
    load().catch(() => toast.error("Failed to load products"));
  }, []);

  async function submit(e) {
    e.preventDefault();
    const payload = {
      id: form.id ? String(form.id) : undefined,
      name: form.name,
      description: form.description,
      price: String(form.price),
      categoryId: String(form.categoryId),
    };
    try {
      if (form.id) {
        await productService.update(payload);
        toast.success("Product updated");
      } else {
        await productService.add(payload);
        toast.success("Product added");
      }
      setForm({ id: "", name: "", description: "", price: "", categoryId: "" });
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Save failed");
    }
  }

  const filtered = useMemo(() => {
    const match = products.filter((p) =>
      `${p.name} ${p.categoryName} ${p.description}`.toLowerCase().includes(search.toLowerCase())
    );
    return match.sort((a, b) => {
      if (sort === "price") return Number(a.price) - Number(b.price);
      if (sort === "category") return String(a.categoryName).localeCompare(String(b.categoryName));
      return String(a.name).localeCompare(String(b.name));
    });
  }, [products, search, sort]);

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="card grid gap-3 p-4 md:grid-cols-2">
        <FormInput label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FormInput label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <FormInput label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button className="rounded-xl bg-brand-600 px-4 py-2 text-white md:col-span-2">{form.id ? "Update Product" : "Add Product"}</button>
      </form>

      <div className="flex gap-2">
        <input placeholder="Search products..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-xl border border-slate-200 px-3" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort by name</option>
          <option value="category">Sort by category</option>
          <option value="price">Sort by price</option>
        </select>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "categoryName", label: "Category" },
          { key: "description", label: "Description" },
          { key: "price", label: "Price", render: (v) => formatCurrency(v) },
        ]}
        data={filtered}
        actions={(row) => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 px-2 py-1 text-xs" onClick={() => setForm({ id: row.id, name: row.name, description: row.description, price: row.price, categoryId: row.categoryId })}>Edit</button>
            <button className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-600" onClick={async () => { await productService.remove(row.id); toast.success("Deleted"); load(); }}>Delete</button>
          </div>
        )}
      />
    </div>
  );
}
