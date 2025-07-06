import React from "react";

interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
}

export default function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <table className="w-full border border-gray-200">
      <thead>
        <tr>
          {columns.map(col => (
            <th className="p-2 border-b bg-gray-100 text-left" key={col.key as string}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td className="p-2 border-b" key={col.key as string}>{(row as any)[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
