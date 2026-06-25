import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerEvent } from "./eventService";
import { ROLES } from "../../constants/roles";
import { deleteEvent } from "./eventService";

export default function EventCard({ event, user }) {
  const navigate = useNavigate();

  if (!event) return null;

  const deadlinePassed =
    new Date(event.registrationDeadline) < new Date();

  async function apply() {
    try {
      await registerEvent(event._id);

      toast.success("Registered successfully");

      window.location.reload();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
  async function handleDelete() {
  if (!window.confirm("Delete this event?")) return;

  try {
    await deleteEvent(event._id);

    toast.success("Event deleted");

    window.location.reload();
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );
  }
}

  function renderStudentButton() {
    // Present
    if (
      event.registration?.attendanceStatus === "Present"
    ) {
      return (
        <button
          disabled
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Present
        </button>
      );
    }

    // Absent
    if (
      event.registration?.attendanceStatus === "Absent"
    ) {
      return (
        <button
          disabled
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Absent
        </button>
      );
    }

    // Registered but attendance not marked
    if (event.registration) {
      return (
        <button
          disabled
          className="rounded bg-slate-600 px-4 py-2 text-white"
        >
          Registered
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
          Timeout
        </button>
      );
    }

    // Register
    return (
      <button
        onClick={apply}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Register
      </button>
    );
  }

  return (
    <div className="rounded-2xl border p-5 shadow-sm">

      {event?.image?.url && (
        <img
          src={event.image.url}
          alt={event.title}
          className="mb-4 h-48 w-full rounded-xl object-cover"
        />
      )}

      <h2 className="text-xl font-bold">
        {event.title}
      </h2>

      <p className="mt-3 text-slate-700">
        {event.description}
      </p>
      <div className="mt-3 rounded bg-gray-50 p-3 text-sm">
  <p>
    <strong>Posted By:</strong>{" "}
    {event.createdBy?.name}
  </p>

  <p>
    <strong>Role:</strong>{" "}
    {event.createdBy?.role === "DEAN_EITP"
      ? "Dean EITP"
      : "Campus Coordinator"}
  </p>

  {event.createdBy?.role === "CAMPUS_COORDINATOR" && (
    <p>
      <strong>Campus:</strong>{" "}
      {event.createdBy?.campus}
    </p>
  )}
</div>

      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <p>
          <span className="font-medium">
            Event Date:
          </span>{" "}
          {event.eventDate
            ? new Date(event.eventDate).toLocaleDateString()
            : "-"}
        </p>

        <p>
          <span className="font-medium">
            Registration Deadline:
          </span>{" "}
          {event.registrationDeadline
            ? new Date(
                event.registrationDeadline
              ).toLocaleDateString()
            : "-"}
        </p>

        {event.eventTime && (
          <p>
            <span className="font-medium">
              Time:
            </span>{" "}
            {event.eventTime}
          </p>
        )}

        <p>
          <span className="font-medium">
            Duration:
          </span>{" "}
          {event.numberOfDays} day(s)
        </p>
      </div>

      <div className="mt-5 flex gap-3">

        {(user.role === ROLES.DEAN_EITP ||
  event.createdBy?._id === user._id) && (
  <button
    onClick={handleDelete}
    className="rounded bg-red-600 px-4 py-2 text-white"
  >
    Delete
  </button>
)}

        {(user?.role === ROLES.STUDENT ||
          user?.role === ROLES.STUDENT_INTERN) &&
          renderStudentButton()}

        {(user?.role === ROLES.DEAN_EITP ||
          user?.role === ROLES.CAMPUS_COORDINATOR ||
          user?.role === ROLES.STUDENT_INTERN) && (
          <button
            className="rounded bg-green-600 px-4 py-2 text-white"
            onClick={() =>
              navigate(`/events/${event._id}`)
            }
          >
            Details
          </button>
        )}

      </div>
    </div>
  );
}