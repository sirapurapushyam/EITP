import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPlacements,
  fetchPlacementStats
} from "../../features/placements/placementSlice";

import { selectCurrentUser } from "../../features/auth/authSlice";
import { ROLES } from "../../constants/roles";

import PlacementStats from "./PlacementStats";
import PlacementCharts from "./PlacementCharts";
import PlacementTable from "./PlacementTable";
import AddPlacementModal from "./AddPlacementModal";


export default function PlacementsPage() {

  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);

  const {
    placements,
    stats,
    status,
    error
  } = useSelector((state) => state.placements);

  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {

    dispatch(fetchPlacements());
    dispatch(fetchPlacementStats());

  }, [dispatch]);

  return (

    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Placements
          </h1>

          <p className="text-gray-500">
            Track placement records across campuses
          </p>

        </div>

        {(user?.role === ROLES.DEAN_EITP ||
          user?.role === ROLES.CAMPUS_COORDINATOR) && (

          <button
            onClick={() => setOpenAddModal(true)}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Placement
          </button>

        )}

      </div>

      {/* Error */}
      {error && (

        <div className="border border-red-300 bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>

      )}

      {/* Loading */}
      {status === "loading" && (

        <div className="text-center py-10">
          Loading placements...
        </div>

      )}

      {/* Stats */}
      {stats && (
        <PlacementStats stats={stats} />
      )}

      {/* Charts */}
      {stats && (
        <PlacementCharts stats={stats} />
      )}

      {/* Table */}
      <PlacementTable
        placements={placements}
        loading={status === "loading"}
      />

      {/* Add Placement Modal */}
      <AddPlacementModal
        open={openAddModal}
        setOpen={setOpenAddModal}
      />

    </div>

  );
}