import React from "react";

export default function DataTable({ columns, data, onRowClick, emptyMessage = "No data found" }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E8E2DD] bg-[#FAFAFA]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-[#8A817A]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8E2DD]/60">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 ${
                  onRowClick ? "cursor-pointer hover:bg-[#FDFBF9]" : "hover:bg-[#FAFAFA]/50"
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-[#2B2420]">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-[#8A817A]">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
