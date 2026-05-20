import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/getAllOrders");
      setOrders(res.data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.post("/order/updateOrderStatus", { id: id.toString(), status });
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "userName", label: "Customer" },
    { key: "totalAmount", label: "Total ($)" },
    { key: "createdAt", label: "Date", render: (v) => new Date(v).toLocaleString() },
    { 
      key: "orderStatus", 
      label: "Status",
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          v === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
          v === 'Preparing' ? 'bg-blue-100 text-blue-700' :
          v === 'Ready' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {v}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, order) => (
        <select
          value={order.orderStatus}
          onChange={(e) => updateStatus(order.id, e.target.value)}
          className="cafe-input py-1 text-sm bg-white"
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Delivered">Delivered</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Online Orders" subtitle="Manage customer orders from the web" />
      <DataTable columns={columns} data={orders} loading={loading} />
    </div>
  );
}
