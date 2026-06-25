import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#dc2626"
];

export default function PlacementCharts({
  stats
}) {

  if (!stats) return null;

  return (

    <div className="grid lg:grid-cols-2 gap-8">

      <div className="border rounded-xl p-4">

        <h2 className="font-bold mb-5">
          Campus Placements
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={stats.byCampus}
              dataKey="total"
              nameKey="_id"
              outerRadius={100}
            >

              {stats.byCampus.map(
                (_, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="border rounded-xl p-4">

        <h2 className="font-bold mb-5">
          Top Companies
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart
            data={stats.byCompany}
          >

            <XAxis dataKey="_id" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count" />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}