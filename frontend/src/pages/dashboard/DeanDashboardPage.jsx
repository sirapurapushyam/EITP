import { useEffect } from "react";
import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  fetchDeanDashboard
} from "../../features/dashboard/dashboardSlice";

import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import StatCard from "../../components/dashboard/StatCard";
import CampusTable from "../../components/dashboard/CampusTable";
import PendingIdeasCard from "../../components/dashboard/PendingIdeasCard";
import RecentPlacementsTable from "../../components/dashboard/RecentPlacementsTable";
import PlacementTrendChart from "../../components/dashboard/PlacementTrendChart";

export default function DeanDashboardPage() {

  const dispatch = useDispatch();

  const {
    data,
    loading
  } = useSelector(
    state => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDeanDashboard());
  }, [dispatch]);

  if (loading)
    return <LoadingSkeleton />;

  console.log("dashboard state", {
  data,
  loading
});

if (loading) {
  return <div>Loading...</div>;
}

if (!data || !data.summary) {
  return (
    <div>
      No dashboard data
    </div>
  );
}

const summary = data.summary;

  return (

    <div className="space-y-8">

      <div className="grid gap-6 md:grid-cols-4">

        <StatCard
          title="Students"
          value={summary.totalStudents}
        />

        <StatCard
          title="Interns"
          value={summary.totalInterns}
        />

        <StatCard
          title="Placements"
          value={summary.totalPlacements}
        />

        <StatCard
          title="Placement Rate"
          value={`${summary.placementRate}%`}
        />

        <StatCard
          title="Jobs"
          value={summary.totalJobs}
        />

        <StatCard
          title="Events"
          value={summary.totalEvents}
        />

        <StatCard
          title="Ideas"
          value={summary.totalIdeas}
        />

      </div>

      <CampusTable
        campusStats={data.campusStats}
      />

      <PlacementTrendChart
        data={data.placementTrend}
      />

      <PendingIdeasCard
        ideas={data.pendingIdeas}
      />

      <RecentPlacementsTable
        placements={data.recentPlacements}
      />

    </div>

  );
}