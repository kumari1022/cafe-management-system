import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, ChefHat, Download, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({ open: false, productId: null, productName: "" });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/getUserOrders");
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/review/add", {
        productId: String(reviewModal.productId),
        rating: String(reviewForm.rating),
        comment: reviewForm.comment
      });
      toast.success("Review submitted!");
      setReviewModal({ open: false, productId: null, productName: "" });
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return { color: "text-yellow-500", bg: "bg-yellow-50", icon: Clock, label: "Pending" };
      case "preparing": return { color: "text-blue-500", bg: "bg-blue-50", icon: ChefHat, label: "Preparing" };
      case "ready": return { color: "text-green-500", bg: "bg-green-50", icon: CheckCircle, label: "Ready" };
      case "delivered": return { color: "text-gray-500", bg: "bg-gray-50", icon: Package, label: "Delivered" };
      default: return { color: "text-cafe-text", bg: "bg-cafe-bg", icon: Package, label: status || "Unknown" };
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cafe-text/60">
        <Package className="w-24 h-24 mb-4 text-cafe-beige" />
        <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
        <p className="mb-6 text-sm">When you place an order, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display text-cafe-text mb-6">My Orders</h2>
      
      <div className="space-y-6">
        {orders.map((order, i) => {
          const status = getStatusConfig(order.orderStatus);
          const StatusIcon = status.icon;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={order.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-cafe-beige"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-cafe-beige">
                <div>
                  <p className="text-sm text-cafe-text/60">Order #{order.id}</p>
                  <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-bold text-sm">{status.label}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cafe-bg rounded-lg flex items-center justify-center text-xl">☕</div>
                      <div>
                        <p className="font-semibold text-cafe-text">{item.productName}</p>
                        <p className="text-xs text-cafe-text/60">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setReviewModal({ open: true, productId: item.productId, productName: item.productName })}
                        className="text-xs font-semibold text-cafe-primary hover:underline"
                      >
                        Write Review
                      </button>
                      <p className="font-bold text-cafe-text">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-cafe-beige flex justify-between items-center">
                <span className="text-cafe-text/80 font-medium">Total Amount</span>
                <span className="text-xl font-bold text-cafe-primary">₹{order.totalAmount}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {reviewModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-cafe-text mb-2">Review: {reviewModal.productName}</h3>
            <p className="text-sm text-cafe-text/60 mb-6">Share your experience with this item.</p>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reviewForm.rating >= num ? "bg-yellow-400 text-white" : "bg-cafe-bg text-cafe-text/40"}`}
                    >
                      <Star className={`w-5 h-5 ${reviewForm.rating >= num ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-2xl border border-cafe-beige p-4 focus:outline-none focus:border-cafe-primary bg-cafe-bg/30"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal({ open: false, productId: null, productName: "" })}
                  className="flex-1 px-4 py-3 rounded-2xl bg-cafe-bg text-cafe-text font-bold hover:bg-cafe-beige transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-2xl bg-cafe-primary text-white font-bold hover:bg-[#4E342E] transition-all disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
