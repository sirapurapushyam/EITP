import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  applyJob,
  deleteJob,
} from "./jobService";
import { ROLES } from "../../constants/roles";

export default function JobCard({
  job,
  user
}) {
  const navigate = useNavigate();

  if (!job) return null;

  const deadlinePassed =
    new Date(job.deadline) < new Date();

  async function apply() {
    try {
      await applyJob(job._id);

      toast.success(
        "Application submitted"
      );

      window.location.reload();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Application failed"
      );
    }
  }
  async function handleDelete() {
  const ok = window.confirm(
    "Delete this job?"
  );

  if (!ok) return;

  try {
    await deleteJob(job._id);

    toast.success(
      "Job deleted successfully"
    );

    window.location.reload();
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Failed to delete job"
    );
  }
}
  function renderApplyButton() {
    // Placed
    if (job.application?.status === "Placed") {
      return (
        <button
          disabled
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Placed
        </button>
      );
    }

    // Shortlisted
    if (job.application?.status === "Shortlisted") {
      return (
        <button
          disabled
          className="rounded bg-yellow-500 px-4 py-2 text-white"
        >
          Shortlisted
        </button>
      );
    }

    // Rejected
    if (job.application?.status === "Rejected") {
      return (
        <button
          disabled
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Rejected
        </button>
      );
    }

    // Applied
    if (job.application) {
      return (
        <button
          disabled
          className="rounded bg-slate-600 px-4 py-2 text-white"
        >
          Applied
        </button>
      );
    }

    // Deadline over
    if (deadlinePassed) {
      return (
        <button
          disabled
          className="rounded bg-gray-400 px-4 py-2 text-white"
        >
          Deadline Over
        </button>
      );
    }

    // Apply
    return (
      <button
        onClick={apply}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Apply
      </button>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      {job.logo?.url && (
        <img
          src={job.logo.url}
          alt={job.companyName}
          className="mb-4 h-40 w-full rounded-xl object-contain"
        />
      )}

      <h2 className="text-xl font-bold">
        {job.companyName}
      </h2>

      <p className="mt-2 text-lg text-slate-700">
        {job.role}
      </p>

      <p className="mt-3 text-slate-600">
        {job.description}
      </p>
      <div className="mt-3 rounded bg-gray-50 p-3 text-sm">

  <p>
    <strong>Posted By:</strong>{" "}
    {job.createdBy?.name}
  </p>

  <p>
    <strong>Role:</strong>{" "}
    {job.createdBy?.role === "DEAN_EITP"
      ? "Dean EITP"
      : "Campus Coordinator"}
  </p>

  {job.createdBy?.role === "CAMPUS_COORDINATOR" && (
    <p>
      <strong>Campus:</strong>{" "}
      {job.createdBy?.campus}
    </p>
  )}

</div>
      <div className="mt-4 space-y-2 text-sm text-slate-500">

        <p>
          <span className="font-medium">
            Package:
          </span>{" "}
          {job.package || job.salary || "-"}
        </p>

        <p>
          <span className="font-medium">
            Deadline:
          </span>{" "}
          {job.deadline
            ? new Date(
                job.deadline
              ).toLocaleDateString()
            : "-"}
        </p>

        <p>
          <span className="font-medium">
            Applications:
          </span>{" "}
          {job.applicationsCount}
        </p>

      </div>

      <div className="mt-5 flex gap-3">
        {(user.role === ROLES.DEAN_EITP ||
  job.createdBy?._id === user._id) && (
  <button
    onClick={handleDelete}
    className="rounded bg-red-600 px-4 py-2 text-white"
  >
    Delete
  </button>
)}

        {(user.role === ROLES.STUDENT ||
          user.role === ROLES.STUDENT_INTERN) &&
          renderApplyButton()}

        {(user.role === ROLES.DEAN_EITP ||
          user.role === ROLES.CAMPUS_COORDINATOR ||
          user.role === ROLES.STUDENT_INTERN) && (
          <button
            className="rounded bg-green-600 px-4 py-2 text-white"
            onClick={() =>
              navigate(`/jobs/${job._id}`)
            }
          >
            Details
          </button>
        )}

      </div>

    </div>
  );
}