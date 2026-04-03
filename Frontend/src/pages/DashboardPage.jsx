import { useEffect, useMemo, useState } from "react";
import { BarChart3, Layers, ReceiptText } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatsCard from "../components/StatsCard";
import Spinner from "../components/Spinner";
import { dashboardService } from "../services/dashboardService";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getDetails()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(
    () => [
      { name: "Categories", value: Number(stats.category || 0) },
      { name: "Products", value: Number(stats.product || 0) },
      { name: "Bills", value: Number(stats.bill || 0) },
    ],
    [stats]
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Categories" value={stats.category || 0} icon={Layers} />
        <StatsCard title="Products" value={stats.product || 0} icon={BarChart3} color="bg-emerald-100" />
        <StatsCard title="Bills" value={stats.bill || 0} icon={ReceiptText} color="bg-amber-100" />
      </div>
      <div className="card h-80 p-4">
        <h3 className="mb-3 font-semibold">Overview Chart</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
