export default function StatsCard({ title, value, icon: Icon, color = "bg-brand-100" }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-slate-800">{value}</p>
        </div>
        <div className={`rounded-xl ${color} p-2`}>
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
    </div>
  );
}
