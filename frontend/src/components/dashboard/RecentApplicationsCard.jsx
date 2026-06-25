import DashboardSection from "./DashboardSection";

export default function RecentApplicationsCard({
  applications = []
}) {

  return (

    <DashboardSection title="Recent Applications">

      <div className="space-y-4">

        {applications.length === 0 && (
          <p className="text-slate-500">
            No applications yet
          </p>
        )}

        {applications.map((item) => (

          <div
            key={item._id}
            className="rounded-2xl border p-4"
          >

            <h3 className="font-semibold">
              {item.job?.companyName}
            </h3>

            <p className="text-sm text-slate-500">
              {item.job?.role}
            </p>

          </div>

        ))}

      </div>

    </DashboardSection>

  );
}