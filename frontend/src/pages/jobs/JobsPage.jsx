import {
  useEffect,
  useState
} from "react";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  selectCurrentUser
} from "../../features/auth/authSlice";

import {
  ROLES
} from "../../constants/roles";

import JobCard from "../../features/jobs/JobCard";
import JobForm from "../../features/jobs/JobForm";

import {
  listJobs
} from "../../features/jobs/jobService";

export default function JobsPage() {

  const user = useSelector(
    selectCurrentUser
  );

  const [jobs, setJobs] =
    useState([]);

  async function load() {

    try {

      const data =
        await listJobs();

      setJobs(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      toast.error(
        "Failed to load jobs"
      );

      setJobs([]);

    }

  }

  useEffect(() => {

    load();

  }, []);

  return (

    <div className="space-y-8">

      {(user?.role === ROLES.DEAN_EITP ||
        user?.role === ROLES.CAMPUS_COORDINATOR) && (

        <JobForm
          user={user}
          reload={load}
        />

      )}

      <div className="grid gap-5 md:grid-cols-2">

        {jobs
          .filter(Boolean)
          .map((job) => (

            <JobCard
              key={job._id}
              job={job}
              user={user}
            />

          ))}

      </div>

    </div>

  );

}