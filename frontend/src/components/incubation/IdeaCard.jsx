import { Link } from "react-router-dom";
import StatusChip from "./StatusChip";

export default function IdeaCard({
  idea,
  showActions = false,
  onApprove,
  onReject
}) {

  return (

    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

      {/* Top */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            {idea.title}
          </h2>

          <p className="mt-3 text-slate-500 leading-relaxed">
            {idea.description}
          </p>

        </div>

        <div className="shrink-0">
          <StatusChip status={idea.status} />
        </div>

      </div>

      {/* Info */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <div>

          <div className="text-xs uppercase tracking-wide text-slate-400">
            Student
          </div>

          <div className="mt-1 font-medium text-slate-700">
            {idea.submittedBy?.name || "-"}
          </div>

        </div>

        <div>

          <div className="text-xs uppercase tracking-wide text-slate-400">
            Campus
          </div>

          <div className="mt-1 font-medium text-slate-700">
            {idea.campus || "-"}
          </div>

        </div>

      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-wrap gap-3">

        <Link
          to={`/incubation/${idea._id}`}
          className="
            rounded-xl
            border
            border-slate-300
            px-5
            py-2.5
            text-sm
            font-medium
            text-slate-700
            hover:bg-slate-100
            transition
          "
        >
          View Details
        </Link>

        {showActions && (

          <>
            <button
              onClick={onApprove}
              className="
                rounded-xl
                bg-green-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                hover:bg-green-700
                transition
              "
            >
              Approve
            </button>

            <button
              onClick={onReject}
              className="
                rounded-xl
                bg-red-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                hover:bg-red-700
                transition
              "
            >
              Reject
            </button>
          </>

        )}

      </div>

    </div>

  );

}