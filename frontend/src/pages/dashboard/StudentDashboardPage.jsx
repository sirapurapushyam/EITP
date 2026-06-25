import { useEffect } from "react";
import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  fetchStudentDashboard
} from "../../features/dashboard/dashboardSlice";

import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import StatCard from "../../components/dashboard/StatCard";
import UpcomingJobsCard from "../../components/dashboard/UpcomingJobsCard";
import UpcomingEventsCard from "../../components/dashboard/UpcomingEventsCard";
import RecentApplicationsCard from "../../components/dashboard/RecentApplicationsCard";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function StudentDashboardPage() {

  const dispatch = useDispatch();

  const {
    data,
    loading
  } = useSelector(
    state => state.dashboard
  );

  useEffect(() => {
    dispatch(
      fetchStudentDashboard()
    );
  }, [dispatch]);

  if (loading)
    return <LoadingSkeleton />;

  if (!data)
    return null;

  const summary = data.summary;

  return (

    <div className="space-y-8">

      <div className="grid gap-6 md:grid-cols-5">

        <StatCard
          title="Applied Jobs"
          value={summary.appliedJobs}
        />

        <StatCard
          title="Events"
          value={summary.registeredEvents}
        />

        <StatCard
          title="Ideas"
          value={summary.submittedIdeas}
        />

        <StatCard
          title="Profile"
          value={`${summary.profileCompletion}%`}
        />

        <StatCard
          title="Placed"
          value={
            data.placement?.company ||
            "No"
          }
        />

      </div>

      <DashboardSection title="Placement Status">

        {data.placement ? (

          <div>

            <p>
              Company :
              {data.placement.company}
            </p>

            <p>
              Role :
              {data.placement.role}
            </p>

            <p>
              Package :
              {data.placement.package}
            </p>

          </div>

        ) : (

          <p>
            Not placed yet
          </p>

        )}

      </DashboardSection>

      <UpcomingJobsCard
        jobs={data.upcomingJobs}
      />

      <UpcomingEventsCard
        events={data.upcomingEvents}
      />

      <RecentApplicationsCard
        applications={
          data.recentApplications
        }
      />

    </div>

  );
}