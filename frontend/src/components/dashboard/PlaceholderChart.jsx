export default function PlaceholderChart({ title, subtitle }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-slate-950">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="grid h-56 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgba(29,78,216,0.08),rgba(245,158,11,0.14))] text-sm text-slate-500">
        Chart placeholder
      </div>
    </div>
  );
}
