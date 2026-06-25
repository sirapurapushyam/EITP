import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import DashboardSection from "./DashboardSection";

export default function PlacementTrendChart({
  data = []
}) {

  const chartData = data.map(item => ({
    month: item._id?.month,
    placements: item.count
  }));

  return (
    <DashboardSection title="Placement Trend">

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="placements"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </DashboardSection>
  );
}