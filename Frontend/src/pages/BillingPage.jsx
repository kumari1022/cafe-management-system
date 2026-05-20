import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { billService } from "../services/billService";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { downloadBlob, formatCurrency, parseApiPayload } from "../utils/formatters";

export default function BillingPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contactNumber: "", paymentMethod: "Cash" });
  const [selection, setSelection] = useState({ categoryId: "", productId: "", quantity: 1 });

  useEffect(() => {
    categoryService
      .getFiltered()
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  useEffect(() => {
    if (!selection.categoryId) {
      setProducts([]);
      return;
    }
    productService
      .getByCategory(selection.categoryId)
      .then((res) => setProducts(res.data || []))
      .catch(() => {
        toast.error("Failed to load products");
        setProducts([]);
      });
  }, [selection.categoryId]);

  const total = useMemo(() => cart.reduce((sum, p) => sum + Number(p.total), 0), [cart]);
  const selectedProduct = products.find((p) => String(p.id) === String(selection.productId));

  function updateQty(id, delta) {
    setCart((items) =>
      items
        .map((item) => {
          if (item.id !== id) return item;
          const quantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity, total: item.price * quantity };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function addItem() {
    const product = products.find((p) => String(p.id) === String(selection.productId));
    if (!product) return toast.error("Select a product");
    const quantity = Math.max(1, Number(selection.quantity || 1));
    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
      updateQty(product.id, quantity);
      setSelection((s) => ({ ...s, productId: "", quantity: 1 }));
      return;
    }
    setCart([
      ...cart,
      {
        id: product.id,
        name: product.name,
        category: product.categoryName || product.category,
        quantity,
        price: Number(product.price),
        total: Number(product.price) * quantity,
      },
    ]);
    setSelection((s) => ({ ...s, productId: "", quantity: 1 }));
  }

  async function generateBill() {
    if (!form.name || !form.email || !form.contactNumber) {
      return toast.error("Please fill customer details");
    }
    if (cart.length === 0) {
      return toast.error("Add at least one item to cart");
    }

    try {
      setGenerating(true);
      const payload = {
        ...form,
        totalAmount: String(total),
        productDetails: JSON.stringify(cart),
      };
      const { data } = await billService.generate(payload);
      const result = parseApiPayload(data);
      if (!result?.uuid) {
        return toast.error("Bill saved but invoice id was missing");
      }
      const pdf = await billService.getPdf({ uuid: result.uuid });
      downloadBlob(pdf.data, `${result.uuid}.pdf`);
      toast.success("Bill generated successfully");
      setCart([]);
      setForm({ name: "", email: "", contactNumber: "", paymentMethod: "Cash" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not generate bill");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" subtitle="Create orders and generate Brew Haven invoices" />

      <div className="cafe-card grid gap-4 p-5 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-cafe-secondary">Customer Name</label>
          <input className="cafe-input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-cafe-secondary">Email</label>
          <input className="cafe-input" type="email" placeholder="john@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-cafe-secondary">Contact Number</label>
          <input className="cafe-input" placeholder="9876543210" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-cafe-secondary">Payment Method</label>
          <select className="cafe-input" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option>Cash</option>
            <option>Card</option>
            <option>UPI</option>
          </select>
        </div>
      </div>

      <div className="cafe-card grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto_auto]">
        <div className="space-y-1">
          <label className="text-sm font-medium text-cafe-secondary">Category</label>
          <select
            className="cafe-input"
            value={selection.categoryId}
            onChange={(e) => setSelection({ ...selection, categoryId: e.target.value, productId: "" })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-cafe-secondary">Product</label>
          <select className="cafe-input" value={selection.productId} onChange={(e) => setSelection({ ...selection, productId: e.target.value })}>
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatCurrency(p.price)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-cafe-secondary">Quantity</label>
          <div className="flex items-center gap-2">
            <button type="button" className="cafe-btn-secondary px-3 py-2" onClick={() => setSelection((s) => ({ ...s, quantity: Math.max(1, Number(s.quantity) - 1) }))}>
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min="1"
              className="cafe-input w-20 text-center"
              value={selection.quantity}
              onChange={(e) => setSelection({ ...selection, quantity: e.target.value })}
            />
            <button type="button" className="cafe-btn-secondary px-3 py-2" onClick={() => setSelection((s) => ({ ...s, quantity: Number(s.quantity) + 1 }))}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-2">
          {selectedProduct && <p className="text-sm text-cafe-secondary">Unit: {formatCurrency(selectedProduct.price)}</p>}
          <button type="button" onClick={addItem} className="cafe-btn py-2.5">
            Add to bill
          </button>
        </div>
      </div>

      <div className="cafe-card space-y-4 p-5">
        <h3 className="font-semibold">Order summary</h3>
        <div className="max-h-72 space-y-2 overflow-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6d5c3] bg-cafe-bg/50 p-3 dark:border-[#5c4033]">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-cafe-secondary">{item.category}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg border border-[#e6d5c3] bg-white dark:bg-cafe-dark-card">
                  <button type="button" className="px-2 py-1 hover:bg-cafe-hover/40" onClick={() => updateQty(item.id, -1)}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                  <button type="button" className="px-2 py-1 hover:bg-cafe-hover/40" onClick={() => updateQty(item.id, 1)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="min-w-[5rem] text-right font-semibold">{formatCurrency(item.total)}</span>
                <button type="button" className="text-red-600 hover:text-red-700" onClick={() => setCart(cart.filter((c) => c.id !== item.id))} aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && <p className="py-8 text-center text-cafe-secondary">No items in cart — add products above</p>}
        </div>

        <div className="flex items-center justify-between border-t border-[#e6d5c3] pt-4 text-lg font-bold dark:border-[#5c4033]">
          <span>Total</span>
          <span className="text-cafe-primary">{formatCurrency(total)}</span>
        </div>

        <button
          type="button"
          className="cafe-btn flex w-full items-center justify-center gap-2 py-3 text-base disabled:opacity-50"
          onClick={generateBill}
          disabled={cart.length === 0 || generating}
        >
          {generating ? <Spinner /> : "Generate Bill PDF"}
        </button>
      </div>
    </div>
  );
}
