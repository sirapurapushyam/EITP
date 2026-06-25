export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-xl font-semibold text-slate-950">{title}</h2>
      {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
