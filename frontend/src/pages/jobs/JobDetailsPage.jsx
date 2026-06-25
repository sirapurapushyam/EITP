import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { selectCurrentUser }
from "../../features/auth/authSlice";

import {
  getApplications
}
from "../../features/jobs/jobService";

import JobStatsCard
from "../../features/jobs/JobStatsCard";

import JobAttendanceTable
from "../../features/jobs/JobAttendanceTable";

import ExportButtons
from "../../features/events/ExportButtons";

export default function JobDetailsPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const user =
    useSelector(
      selectCurrentUser
    );

  const [data, setData] =
    useState(null);

  async function load() {

    try {

      const res =
        await getApplications(
          id
        );

      setData(res);

    } catch {

      toast.error(
        "Unable to load job details"
      );

    }

  }

  useEffect(() => {

    load();

  }, [id]);

  if (!data) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  if (user.role === "DEAN_EITP") {

    return (

      <div className="space-y-6">

        <button
          onClick={() => navigate(-1)}
          className="rounded bg-slate-700 px-4 py-2 text-white"
        >
          ← Back
        </button>

        <JobStatsCard
          applicationsCount={
            data.applicationsCount
          }
          presentCount={
            data.presentCount
          }
          absentCount={
            data.absentCount
          }
        />

        {/* <ExportButtons
          type="jobs"
          id={id}
        /> */}

      </div>

    );

  }

  return (

    <div className="space-y-8">

      <button
        onClick={() => navigate(-1)}
        className="rounded bg-slate-700 px-4 py-2 text-white"
      >
        ← Back
      </button>

      {/* <ExportButtons
        type="jobs"
        id={id}
      /> */}

      <div className="rounded-2xl border p-5">

        <h2 className="mb-4 text-xl font-bold">
          Pending Students
        </h2>

        <JobAttendanceTable
          jobId={id}
          students={
            data.pendingStudents
          }
          reload={load}
          canUpdateStatus
        />

      </div>

      <div className="rounded-2xl border p-5">

        <h2 className="mb-4 text-xl font-bold text-green-700">
          Present Students
        </h2>

        <JobAttendanceTable
          jobId={id}
          students={
            data.presentStudents
          }
          reload={load}
          canUpdateStatus
        />

      </div>

      <div className="rounded-2xl border p-5">

        <h2 className="mb-4 text-xl font-bold text-red-700">
          Absent Students
        </h2>

        <JobAttendanceTable
          jobId={id}
          students={
            data.absentStudents
          }
          reload={load}
          canUpdateStatus
        />

      </div>

    </div>

  );

}