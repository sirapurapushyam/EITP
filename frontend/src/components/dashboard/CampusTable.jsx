import DashboardSection from "./DashboardSection";
import DashboardTable from "./DashboardTable";

export default function CampusTable({
  campusStats = []
}) {

  const columns = [
    {
      title: "Campus",
      key: "_id"
    },
    {
      title: "Students",
      key: "students"
    },
    {
      title: "Interns",
      key: "interns"
    },
    {
      title: "Placements",
      key: "placed"
    }
  ];

  return (
    <DashboardSection title="Campus Overview">
      <DashboardTable
        columns={columns}
        data={campusStats}
      />
    </DashboardSection>
  );
}