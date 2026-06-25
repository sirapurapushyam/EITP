import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { selectCurrentUser } from "../../features/auth/authSlice";
import EventStatsCard from "../../features/events/EventStatsCard";
import EventAttendanceTable from "../../features/events/EventAttendanceTable";
import ExportButtons from "../../features/events/ExportButtons";
import { getRegistrations } from "../../features/events/eventService";

export default function EventDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const user = useSelector(
    selectCurrentUser
  );

  const [data, setData] = useState(null);

  async function load() {
    try {
      const res =
        await getRegistrations(id);

      setData(res);
    } catch {
      toast.error(
        "Unable to load event details"
      );
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (!data) {
    return (
      <div className="text-center">
        Loading...
      </div>
    );
  }

  // Dean Dashboard
  if (user.role === "DEAN_EITP") {
    return (
      <div className="space-y-6">
        <button
          className="rounded bg-slate-700 px-4 py-2 text-white"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <EventStatsCard
          registrationCount={
            data.registrationCount
          }
          presentCount={
            data.presentCount
          }
          absentCount={
            data.absentCount
          }
        />

        {/* <ExportButtons eventId={id} /> */}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        className="rounded bg-slate-700 px-4 py-2 text-white"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* <ExportButtons eventId={id} /> */}

      <div className="rounded-2xl border p-5">
        <h2 className="mb-4 text-xl font-bold">
          Pending Students
        </h2>

        <EventAttendanceTable
          eventId={id}
          students={data.pendingStudents}
          reload={load}
        />
      </div>

      <div className="rounded-2xl border p-5">
        <h2 className="mb-4 text-xl font-bold text-green-700">
          Present Students
        </h2>

        <EventAttendanceTable
          eventId={id}
          students={data.presentStudents}
          reload={load}
        />
      </div>

      <div className="rounded-2xl border p-5">
        <h2 className="mb-4 text-xl font-bold text-red-700">
          Absent Students
        </h2>

        <EventAttendanceTable
          eventId={id}
          students={data.absentStudents}
          reload={load}
        />
      </div>
    </div>
  );
}