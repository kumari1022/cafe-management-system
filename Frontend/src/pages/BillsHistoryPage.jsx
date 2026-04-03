import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import { billService } from "../services/billService";
import { downloadBlob, formatCurrency } from "../utils/formatters";

export default function BillsHistoryPage() {
  const [rows, setRows] = useState([]);

  async function load() {
    const { data } = await billService.getAll();
    setRows(data || []);
  }

  useEffect(() => {
    load().catch(() => toast.error("Failed to load bills"));
  }, []);

  async function download(row) {
    const payload = {
      uuid: row.uuid,
      name: row.name,
      email: row.email,
      contactNumber: row.contactNumber,
      paymentMethod: row.paymentMethod,
      totalAmount: String(row.total),
      productDetails: row.productDetails,
    };
    const res = await billService.getPdf(payload);
    downloadBlob(res.data, `${row.uuid}.pdf`);
  }

  return (
    <DataTable
      columns={[
        { key: "name", label: "Customer" },
        { key: "email", label: "Email" },
        { key: "contactNumber", label: "Contact" },
        { key: "paymentMethod", label: "Payment" },
        { key: "total", label: "Total", render: (v) => formatCurrency(v) },
      ]}
      data={rows}
      actions={(row) => (
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-200 px-2 py-1 text-xs" onClick={() => download(row)}>PDF</button>
          <button className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-600" onClick={async () => { await billService.remove(row.id); toast.success("Bill deleted"); load(); }}>Delete</button>
        </div>
      )}
    />
  );
}
