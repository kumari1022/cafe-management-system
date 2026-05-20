import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { Trash2, Star } from "lucide-react";

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/review/getAll");
      setReviews(res.data);
    } catch {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.post(`/review/delete/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "userName", label: "Customer" },
    { key: "productName", label: "Product" },
    { 
      key: "rating", 
      label: "Rating",
      render: (v) => (
        <div className="flex items-center text-yellow-500">
          {v} <Star className="w-4 h-4 ml-1 fill-current" />
        </div>
      )
    },
    { key: "comment", label: "Comment" },
    { key: "createdAt", label: "Date", render: (v) => new Date(v).toLocaleDateString() },
    {
      key: "actions",
      label: "Actions",
      render: (_, review) => (
        <button
          onClick={() => deleteReview(review.id)}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews Management" subtitle="Moderate customer reviews" />
      <DataTable columns={columns} data={reviews} loading={loading} />
    </div>
  );
}
