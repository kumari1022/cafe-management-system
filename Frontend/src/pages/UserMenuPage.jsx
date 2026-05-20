import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Star, Coffee } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Spinner from "../components/Spinner";

const BASE_URL = "http://localhost:8082";

export default function UserMenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/category/get"),
          api.get("/product/get"),
        ]);
        setCategories(catRes.data || []);
        // Only show products with status true
        const available = (prodRes.data || []).filter(
          (p) => String(p.status) === "true"
        );
        setProducts(available);
      } catch (err) {
        toast.error("Failed to load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Use Number() coercion to handle string vs number id mismatch from backend
  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCat === "All" || Number(p.categoryId) === Number(selectedCat);
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cafe_cart")) || [];
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cafe_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} added to cart! ☕`);
    } catch {
      toast.error("Could not add to cart.");
    }
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${BASE_URL}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-cafe-text/60">
        <Spinner size="lg" />
        <p className="mt-4 text-sm">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-display text-cafe-text">
          Our Menu
        </h1>
        <p className="text-cafe-text/60 text-sm">
          {products.length} items available · Freshly brewed every day
        </p>
      </div>

      {/* Search + Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-cafe-beige">
        {/* Search Input */}
        <div className="relative flex-shrink-0 w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cafe-text/40" />
          <input
            id="menu-search"
            type="text"
            placeholder="Search our menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-cafe-beige rounded-xl focus:outline-none focus:border-cafe-primary text-cafe-text bg-cafe-bg/50 text-sm transition-all focus:ring-2 focus:ring-cafe-primary/20 placeholder:text-cafe-text/40"
          />
        </div>

        {/* Category Tabs — horizontally scrollable on small screens */}
        <div
          className="flex gap-2 overflow-x-auto flex-1 pb-1 md:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={() => setSelectedCat("All")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
              selectedCat === "All"
                ? "bg-cafe-primary text-white shadow-md"
                : "bg-cafe-beige/60 text-cafe-text hover:bg-cafe-beige"
            }`}
          >
            ☕ All Items
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                Number(selectedCat) === Number(c.id)
                  ? "bg-cafe-primary text-white shadow-md"
                  : "bg-cafe-beige/60 text-cafe-text hover:bg-cafe-beige"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-cafe-text/60">
          {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "
          <span className="font-semibold text-cafe-primary">{search}</span>"
        </p>
      )}

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-cafe-text/50"
          >
            <Coffee className="w-16 h-16 mb-4 text-cafe-beige" />
            <h3 className="text-xl font-bold mb-1">No items found</h3>
            <p className="text-sm">
              {search
                ? `No results for "${search}". Try a different keyword.`
                : "No products available in this category."}
            </p>
            {(search || selectedCat !== "All") && (
              <button
                onClick={() => { setSearch(""); setSelectedCat("All"); }}
                className="mt-4 text-cafe-primary font-semibold text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((p, i) => {
              const imgSrc = getImageSrc(p.imageUrl);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cafe-beige flex flex-col group hover:shadow-cafe-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-cafe-beige/40 relative overflow-hidden">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {/* Fallback placeholder */}
                    <div
                      className="w-full h-full flex items-center justify-center text-5xl"
                      style={{ display: imgSrc ? "none" : "flex" }}
                    >
                      ☕
                    </div>

                    {/* Price badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-xl font-bold text-cafe-primary text-sm shadow-sm">
                      ₹{p.price}
                    </div>

                    {/* Category badge */}
                    {p.categoryName && (
                      <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur text-white text-xs px-2 py-1 rounded-lg">
                        {p.categoryName}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-base text-cafe-text line-clamp-1 mb-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-cafe-text/55 line-clamp-2 flex-1 leading-relaxed">
                      {p.description || "A delightful brew crafted with care."}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 text-cafe-beige fill-current" />
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        id={`add-to-cart-${p.id}`}
                        className="bg-cafe-primary text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#7f5539] active:scale-95 transition-all duration-200 shadow-sm"
                        title={`Add ${p.name} to cart`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
