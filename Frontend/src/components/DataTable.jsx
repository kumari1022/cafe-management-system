export default function DataTable({ columns, data, actions, emptyMessage = "No records found" }) {
  return (
    <div className="cafe-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cafe-sidebar text-left dark:bg-cafe-dark-sidebar">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold text-cafe-text dark:text-cafe-dark-text">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id ?? row.uuid ?? idx}
                className="border-t border-[#e6d5c3] transition-colors hover:bg-cafe-hover/20 dark:border-[#5c4033]"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-cafe-text dark:text-cafe-dark-text">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && <td className="px-4 py-3">{actions(row)}</td>}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-cafe-secondary">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
