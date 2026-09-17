import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyText: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  emptyText,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-stroke dark:border-strokedark">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-3 font-semibold text-black dark:text-white"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-8 text-center text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-b border-stroke last:border-0 dark:border-strokedark"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-3 py-3 text-gray-600 dark:text-gray-300"
                  >
                    {column.render
                      ? column.render(row)
                      : (row[column.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
