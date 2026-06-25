import DashboardSection from "./DashboardSection";
import DashboardTable from "./DashboardTable";

export default function RecentPlacementsTable({
  placements = []
}) {

  const rows = placements.map((placement) => ({
    student: placement.student?.name,
    branch: placement.student?.branch,
    company: placement.company,
    role: placement.role
  }));

  const columns = [
    {
      title: "Student",
      key: "student"
    },
    {
      title: "Branch",
      key: "branch"
    },
    {
      title: "Company",
      key: "company"
    },
    {
      title: "Role",
      key: "role"
    }
  ];

  return (
    <DashboardSection title="Recent Placements">

      <DashboardTable
        columns={columns}
        data={rows}
      />

    </DashboardSection>
  );
}
