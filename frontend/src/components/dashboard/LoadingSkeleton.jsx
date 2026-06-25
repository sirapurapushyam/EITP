export default function LoadingSkeleton() {
  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-3xl bg-slate-200"
          />
        ))}
      </div>

      <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />

    </div>
  );
}