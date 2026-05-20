import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import Spinner from "../components/Spinner";
import { dashboardService } from "../services/dashboardService";
import { billService } from "../services/billService";

export default function DashboardPage() {
  const [stats, setStats] = useState({ category: 0, product: 0, bill: 0 });
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.getDetails(), billService.getAll()])
      .then(([s, b]) => {
        setStats(s.data || {});
        setBills((b.data || []).slice(0, 5));
      })
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

  const revenue = bills.reduce((sum, b) => sum + Number(b.total || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Live analytics from your Brew Haven cafe" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Categories" value={stats.category || 0} icon="🥐" delay={0.05} />
        <StatsCard title="Products" value={stats.product || 0} icon="🍰" delay={0.1} />
        <StatsCard title="Total Bills" value={stats.bill || 0} icon="📜" delay={0.15} />
        <StatsCard title="Recent Revenue" value={`Rs ${revenue}`} icon="💰" delay={0.2} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cafe-card h-80 p-4">
          <h3 className="mb-3 font-semibold">Overview</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6d5c3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#9c6644" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="cafe-card h-80 p-4">
          <h3 className="mb-3 font-semibold">Daily Sales Trend</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6d5c3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#7f5539" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="cafe-card p-4">
        <h3 className="mb-3 font-semibold">Recent Bills</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cafe-sidebar text-left dark:bg-cafe-dark-sidebar">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.id || b.uuid} className="border-t border-[#e6d5c3] hover:bg-cafe-hover/30">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.paymentMethod}</td>
                  <td className="p-3 font-medium">Rs {b.total}</td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-cafe-secondary">
                    No bills yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
