import { useEffect } from "react";
import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  fetchInternDashboard
} from "../../features/dashboard/dashboardSlice";

import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import StatCard from "../../components/dashboard/StatCard";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function InternDashboardPage() {

  const dispatch = useDispatch();

  const {
    data,
    loading
  } = useSelector(
    state => state.dashboard
  );

  useEffect(() => {
    dispatch(
      fetchInternDashboard()
    );
  }, [dispatch]);

  if (loading)
    return <LoadingSkeleton />;

  if (!data)
    return null;

  return (

    <div className="space-y-8">

      <div className="grid gap-6 md:grid-cols-4">

        <StatCard
          title="Applied Jobs"
          value={
            data.summary.appliedJobs
          }
        />

        <StatCard
          title="Events"
          value={
            data.summary.registeredEvents
          }
        />

        <StatCard
          title="Job Attendance"
          value={
            data.attendance
              .jobAttendance
          }
        />

        <StatCard
          title="Event Attendance"
          value={
            data.attendance
              .eventAttendance
          }
        />

      </div>

      <DashboardSection title="Recent Attendance">

        <div className="space-y-4">

          {data.recentAttendance.map(
            (attendance) => (

              <div
                key={attendance._id}
                className="rounded-2xl border p-4"
              >

                <p className="font-medium">
                  {
                    attendance.student
                      ?.name
                  }
                </p>

                <p className="text-sm text-slate-500">
                  {
                    attendance.event
                      ?.title
                  }
                </p>

              </div>

            )
          )}

        </div>

      </DashboardSection>

    </div>

  );
}