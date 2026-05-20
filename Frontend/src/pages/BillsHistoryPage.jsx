import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { billService } from "../services/billService";
import { downloadBlob, formatCurrency } from "../utils/formatters";

export default function BillsHistoryPage() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState([]);

  async function load() {
    const { data } = await billService.getAll();
    setRows(data || []);
  }

  useEffect(() => {
    load().catch(() => toast.error("Failed to load bills"));
  }, []);

  async function download(row) {
    try {
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
    } catch {
      toast.error("Could not download PDF");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bills History"
        subtitle={isAdmin ? "All invoices generated at Brew Haven" : "Your generated invoices"}
      />
      <DataTable
        columns={[
          { key: "name", label: "Customer" },
          { key: "email", label: "Email" },
          { key: "contactNumber", label: "Contact" },
          { key: "paymentMethod", label: "Payment" },
          { key: "total", label: "Total", render: (v) => formatCurrency(v) },
        ]}
        data={rows}
        emptyMessage="No bills found yet"
        actions={(row) => (
          <div className="flex gap-2">
            <button className="cafe-btn-secondary px-2 py-1 text-xs" onClick={() => download(row)}>
              PDF
            </button>
            {isAdmin && (
              <button
                className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                onClick={async () => {
                  await billService.remove(row.id);
                  toast.success("Bill deleted");
                  load();
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
}
