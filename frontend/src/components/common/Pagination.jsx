export default function Pagination({
  page,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">

      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-slate-300 px-4 py-2 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-slate-300 px-4 py-2 disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}