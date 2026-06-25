export default function JobStatsCard({
  applicationsCount,
  presentCount,
  absentCount
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">

      <div className="rounded-2xl bg-blue-50 p-6">
        <h3 className="text-sm text-slate-500">
          Applications
        </h3>

        <p className="text-4xl font-bold">
          {applicationsCount}
        </p>
      </div>

      <div className="rounded-2xl bg-green-50 p-6">
        <h3 className="text-sm text-slate-500">
          Present
        </h3>

        <p className="text-4xl font-bold">
          {presentCount}
        </p>
      </div>

      <div className="rounded-2xl bg-red-50 p-6">
        <h3 className="text-sm text-slate-500">
          Absent
        </h3>

        <p className="text-4xl font-bold">
          {absentCount}
        </p>
      </div>

    </div>
  );
}