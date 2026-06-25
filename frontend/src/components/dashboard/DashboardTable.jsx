export default function DashboardTable({
  columns,
  data
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">

        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left font-semibold"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b last:border-none"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-4"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
