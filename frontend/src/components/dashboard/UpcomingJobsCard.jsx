import DashboardSection from "./DashboardSection";

export default function UpcomingJobsCard({
  jobs = []
}) {
  return (
    <DashboardSection title="Upcoming Jobs">

      <div className="space-y-4">

        {jobs.length === 0 && (
          <p className="text-slate-500">
            No active jobs
          </p>
        )}

        {jobs.map((job) => (

          <div
            key={job._id}
            className="rounded-2xl border p-4"
          >

            <h3 className="font-semibold">
              {job.companyName}
            </h3>

            <p className="text-sm text-slate-500">
              {job.role}
            </p>

          </div>

        ))}

      </div>

    </DashboardSection>
  );
}