import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { deletePlacement } from "../../features/placements/placementSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { ROLES } from "../../constants/roles";
import EditPlacementModal from "./EditPlacementModal";


export default function PlacementTable({ placements, loading }) {

  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [search, setSearch] = useState("");
  const [campusFilter, setCampusFilter] = useState("");
  const [editOpen, setEditOpen] = useState(false);
const [selectedPlacement, setSelectedPlacement] = useState(null);

  const filteredPlacements = useMemo(() => {

    return placements.filter((p) => {

      const matchesSearch =
        p.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.company?.toLowerCase().includes(search.toLowerCase());

      const matchesCampus =
        !campusFilter || p.campus === campusFilter;

      return matchesSearch && matchesCampus;

    });

  }, [placements, search, campusFilter]);

  const handleDelete = (id) => {

    const ok = window.confirm(
      "Delete this placement?"
    );

    if (!ok) return;

    dispatch(deletePlacement(id));

  };

  if (loading) {
    return <div>Loading placements...</div>;
  }

  return (

    <div className="space-y-4">

     <div className="flex flex-col sm:flex-row gap-3 w-full">

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search student or company..."
    className="w-full sm:flex-1 border rounded-lg p-2.5"
  />

  <input
    value={campusFilter}
    onChange={(e) => setCampusFilter(e.target.value)}
    placeholder="Campus"
    className="w-full sm:w-56 border rounded-lg p-2.5"
  />

</div>

      <div className="overflow-auto">

        <table className="w-full border">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3">Student</th>
              <th className="p-3">Campus</th>
              <th className="p-3">Company</th>
              <th className="p-3">Role</th>
              <th className="p-3">Type</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Package</th>
              <th className="p-3">Date</th>

              {(user.role === ROLES.DEAN_EITP ||
                user.role === ROLES.CAMPUS_COORDINATOR) && (
                <th className="p-3">
                  Actions
                </th>
              )}

            </tr>

          </thead>

          <tbody>

            {filteredPlacements.map((placement) => (

              <tr
                key={placement._id}
                className="border-t"
              >

                <td className="p-3">
                  {placement.student?.name}
                </td>

                <td className="p-3">
                  {placement.campus}
                </td>

                <td className="p-3">
                  {placement.company}
                </td>

                <td className="p-3">
                  {placement.role}
                </td>

                <td className="p-3">
                  {placement.jobType}
                </td>

                <td className="p-3">
                  {placement.workMode}
                </td>

                <td className="p-3">
                  {placement.package} LPA
                </td>

                <td className="p-3">
                  {new Date(
                    placement.dateOfOffer
                  ).toLocaleDateString()}
                </td>

                {(user.role === ROLES.DEAN_EITP ||
                  user.role === ROLES.CAMPUS_COORDINATOR) && (

                  <td className="p-3 flex gap-2">

                    <button
  type="button"
  className="bg-blue-600 text-white px-3 py-1 rounded"
  onClick={() => {
    setSelectedPlacement(placement);
    setEditOpen(true);
  }}
>
  Edit
</button>

                    {user.role === ROLES.DEAN_EITP && (

                      <button
                        onClick={() =>
                          handleDelete(placement._id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    )}

                  </td>

                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>
<EditPlacementModal
  open={editOpen}
  setOpen={setEditOpen}
  placement={selectedPlacement}
/>
    </div>

  );
}