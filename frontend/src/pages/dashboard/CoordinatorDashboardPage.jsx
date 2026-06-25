import { useEffect } from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  fetchCoordinatorDashboard
} from "../../features/dashboard/dashboardSlice";

import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import StatCard from "../../components/dashboard/StatCard";
import PendingIdeasCard from "../../components/dashboard/PendingIdeasCard";
import RecentPlacementsTable from "../../components/dashboard/RecentPlacementsTable";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function CoordinatorDashboardPage() {

  const dispatch = useDispatch();

  const {
    data,
    loading
  } = useSelector(
    state => state.dashboard
  );

  useEffect(() => {
    dispatch(
      fetchCoordinatorDashboard()
    );
  }, [dispatch]);

  if (loading)
    return <LoadingSkeleton />;

  if (!data)
    return null;

  const summary = data.summary;

  return (

    <div className="space-y-8">

      <div className="grid gap-6 md:grid-cols-4">

        <StatCard
          title="Students"
          value={summary.students}
        />

        <StatCard
          title="Interns"
          value={summary.interns}
        />

        <StatCard
          title="Placements"
          value={summary.placements}
        />

        <StatCard
          title="Jobs"
          value={summary.jobs}
        />

        <StatCard
          title="Events"
          value={summary.events}
        />

      </div>

      <DashboardSection title="Branch Distribution">

        <div className="space-y-3">

          {data.branchDistribution.map(branch => (

            <div
              key={branch._id}
              className="flex justify-between rounded-xl border p-3"
            >

              <span>{branch._id}</span>

              <span>
                {branch.count}
              </span>

            </div>

          ))}

        </div>

      </DashboardSection>

      <DashboardSection title="Year Distribution">

        <div className="space-y-3">

          {data.yearDistribution.map(year => (

            <div
              key={year._id}
              className="flex justify-between rounded-xl border p-3"
            >

              <span>{year._id}</span>

              <span>
                {year.count}
              </span>

            </div>

          ))}

        </div>

      </DashboardSection>

      <PendingIdeasCard
        ideas={data.pendingIdeas}
      />

      <RecentPlacementsTable
        placements={data.recentPlacements}
      />

    </div>

  );
}