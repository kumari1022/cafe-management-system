import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { billService } from "../services/billService";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { downloadBlob, formatCurrency } from "../utils/formatters";

export default function BillingPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", contactNumber: "", paymentMethod: "Cash" });
  const [selection, setSelection] = useState({ categoryId: "", productId: "", quantity: 1 });

  useEffect(() => {
    categoryService.getFiltered().then((res) => {
      setCategories(res.data || []);
    }).catch((error) => {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    });
  }, []);

  useEffect(() => {
    if (!selection.categoryId) {
      setProducts([]);
      return;
    }
    
    productService.getByCategory(selection.categoryId)
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
        setProducts([]);
      });
  }, [selection.categoryId]);

  const total = useMemo(() => cart.reduce((sum, p) => sum + Number(p.total), 0), [cart]);

  function addItem() {
    const product = products.find((p) => String(p.id) === String(selection.productId));
    
    if (!product) return toast.error("Select a product");
    if (cart.some((c) => c.id === product.id)) return toast.error("Product already added");
    
    const quantity = Number(selection.quantity || 1);
    const cartItem = { 
      id: product.id, 
      name: product.name, 
      category: product.categoryName || product.category, 
      quantity, 
      price: Number(product.price), 
      total: Number(product.price) * quantity 
    };
    
    setCart([...cart, cartItem]);
    setSelection({ ...selection, productId: "", quantity: 1 });
  }

  async function generateBill() {
    if (!form.name || !form.email || !form.contactNumber) {
      return toast.error("Please fill customer details");
    }
    if (cart.length === 0) {
      return toast.error("Add at least one item to cart");
    }

    try {
      const payload = {
        ...form,
        totalAmount: String(total),
        productDetails: JSON.stringify(cart),
      };
      const { data } = await billService.generate(payload);
      const pdf = await billService.getPdf({ uuid: data.uuid });
      downloadBlob(pdf.data, `${data.uuid}.pdf`);
      toast.success("Bill generated");
      setCart([]);
      setForm({ name: "", email: "", contactNumber: "", paymentMethod: "Cash" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not generate bill");
    }
  }

  return (
    <div className="space-y-4">
      <div className="card grid gap-3 p-4 md:grid-cols-2">
        <input className="rounded-xl border px-3 py-2" placeholder="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded-xl border px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="rounded-xl border px-3 py-2" placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        <select className="rounded-xl border px-3 py-2" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
          <option>Cash</option>
          <option>Card</option>
          <option>UPI</option>
        </select>
      </div>

      <div className="card grid gap-3 p-4 md:grid-cols-4">
        <select className="rounded-xl border px-3 py-2" value={selection.categoryId} onChange={(e) => setSelection({ ...selection, categoryId: e.target.value, productId: "" })}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="rounded-xl border px-3 py-2" value={selection.productId} onChange={(e) => setSelection({ ...selection, productId: e.target.value })}>
          <option value="">Select product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="number" min="1" className="rounded-xl border px-3 py-2" value={selection.quantity} onChange={(e) => setSelection({ ...selection, quantity: e.target.value })} />
        <button onClick={addItem} className="rounded-xl bg-brand-600 text-white py-2">Add to bill</button>
      </div>

      <div className="card p-4 space-y-2">
        <div className="max-h-60 overflow-auto space-y-2">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border p-2">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-slate-500">{item.category}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">{item.quantity} x {formatCurrency(item.price)}</span>
                <span className="font-semibold">{formatCurrency(item.total)}</span>
                <button className="text-rose-600 text-sm font-medium" onClick={() => setCart(cart.filter((c) => c.id !== item.id))}>Remove</button>
              </div>
            </div>
          ))}
          {cart.length === 0 && <div className="text-center py-4 text-slate-400">No items added to cart</div>}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <button className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors" onClick={generateBill} disabled={cart.length === 0}>Generate Bill PDF</button>
      </div>
    </div>
  );
}

