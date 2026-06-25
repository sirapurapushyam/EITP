export default function DashboardSection({
  title,
  children
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}