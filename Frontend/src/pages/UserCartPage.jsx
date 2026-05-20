import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, CreditCard, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function UserCartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("cafe_cart")) || [];
      setCart(saved);
    } catch {
      setCart([]);
    }
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cafe_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
    toast.success("Item removed");
  };

  const clearCart = () => {
    updateCart([]);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      setLoading(true);
      const totalAmount = Math.round(cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0));
      const payload = {
        totalAmount,
        items: cart.map(item => ({
          productId: parseInt(item.id),
          quantity: parseInt(item.quantity),
          price: Math.round(Number(item.price))
        }))
      };
      
      await api.post("/order/placeOrder", payload);
      toast.success("🎉 Order placed successfully!");
      clearCart();
      navigate("/user/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = Math.round(cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0));

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cafe-text/60">
        <ShoppingBag className="w-24 h-24 mb-4 text-cafe-beige" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="mb-6 text-sm">Looks like you haven't added any coffee yet.</p>
        <button onClick={() => navigate("/user/menu")} className="cafe-btn px-6">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold font-display text-cafe-text">Your Cart</h2>
        
        {cart.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-cafe-beige flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-cafe-beige/50 rounded-xl overflow-hidden flex items-center justify-center text-2xl flex-shrink-0">
              {item.imageUrl
                ? <img src={`http://localhost:8082${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} />
                : null
              }
              <span style={{display: item.imageUrl ? 'none' : 'flex'}}>☕</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-cafe-text">{item.name}</h3>
              <p className="text-cafe-text/60 text-sm">₹{item.price} × {item.quantity}</p>
            </div>
            
            <div className="flex items-center gap-3 bg-cafe-bg rounded-lg p-1 border border-cafe-beige">
              <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md text-cafe-text transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold w-4 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md text-cafe-text transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="font-bold w-20 text-right text-cafe-primary">
              ₹{Math.round(Number(item.price) * item.quantity)}
            </div>
            
            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-cafe-beige sticky top-32">
          <h3 className="text-lg font-bold text-cafe-text mb-4">Order Summary</h3>
          
          <div className="space-y-3 text-sm text-cafe-text/80 mb-4 border-b border-cafe-beige pb-4">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-6">
            <span className="font-bold text-cafe-text">Total</span>
            <span className="text-2xl font-bold text-cafe-primary">₹{total}</span>
          </div>
          
          <button
            onClick={placeOrder}
            disabled={loading}
            className="cafe-btn w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? <Spinner /> : <><CreditCard className="w-5 h-5" /> Place Order</>}
          </button>
        </div>
      </div>
    </div>
  );
}
