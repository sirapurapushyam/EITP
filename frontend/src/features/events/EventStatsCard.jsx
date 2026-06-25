export default function EventStatsCard({
  registrationCount,
  presentCount,
  absentCount
}) {
  return (
    <div className="grid md:grid-cols-3 gap-5">

      <div className="rounded-2xl bg-blue-50 p-6">
        <h3 className="text-sm text-slate-500">
          Registrations
        </h3>

        <p className="text-4xl font-bold">
          {registrationCount}
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