import React from "react";

interface TableProps<T extends Record<string, React.ReactNode>> {
  columns: { key: keyof T; label: string }[];
  data: T[];
}

export default function Table<T extends Record<string, React.ReactNode>>({ columns, data }: TableProps<T>) {
  return (
    <table className="w-full border border-gray-200">
      <thead>
        <tr>
          {columns.map(col => (
            <th className="p-2 border-b bg-gray-100 text-left" key={String(col.key)}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td className="p-2 border-b" key={String(col.key)}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
