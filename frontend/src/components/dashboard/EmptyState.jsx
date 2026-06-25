export default function EmptyState({
  title = "No data found"
}) {
  return (
    <div className="flex h-40 items-center justify-center rounded-3xl border border-dashed border-slate-300">

      <p className="text-slate-500">
        {title}
      </p>

    </div>
  );
}