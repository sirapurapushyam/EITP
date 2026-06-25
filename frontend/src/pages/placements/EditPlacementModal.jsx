import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePlacement } from "../../features/placements/placementSlice";

export default function EditPlacementModal({
  open,
  setOpen,
  placement
}) {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    company: "",
    role: "",
    jobType: "",
    workMode: "",
    package: "",
    dateOfOffer: ""
  });

  useEffect(() => {

    if (placement) {

      setForm({
        company: placement.company,
        role: placement.role,
        jobType: placement.jobType,
        workMode: placement.workMode,
        package: placement.package,
        dateOfOffer: placement.dateOfOffer?.slice(0,10)
      });

    }

  }, [placement]);

  if (!open || !placement) return null;

  const handleSubmit = async (e) => {

    e.preventDefault();

    await dispatch(
      updatePlacement({
        id: placement._id,
        payload: form
      })
    );

    setOpen(false);

  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl p-6 w-[500px]">

        <h2 className="text-2xl font-bold mb-5">
          Edit Placement
        </h2>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >

          <input
            className="border p-2 w-full"
            value={form.company}
            onChange={(e)=>
              setForm({...form,company:e.target.value})
            }
          />

          <input
            className="border p-2 w-full"
            value={form.role}
            onChange={(e)=>
              setForm({...form,role:e.target.value})
            }
          />

          <select
            className="border p-2 w-full"
            value={form.jobType}
            onChange={(e)=>
              setForm({...form,jobType:e.target.value})
            }
          >
            <option>Internship</option>
            <option>FullTime</option>
            <option>Intern+FullTime</option>
          </select>

          <select
            className="border p-2 w-full"
            value={form.workMode}
            onChange={(e)=>
              setForm({...form,workMode:e.target.value})
            }
          >
            <option>Remote</option>
            <option>Hybrid</option>
            <option>InOffice</option>
          </select>

          <input
            type="number"
            className="border p-2 w-full"
            value={form.package}
            onChange={(e)=>
              setForm({...form,package:e.target.value})
            }
          />

          <input
            type="date"
            className="border p-2 w-full"
            value={form.dateOfOffer}
            onChange={(e)=>
              setForm({...form,dateOfOffer:e.target.value})
            }
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              className="border px-4 py-2 rounded"
              onClick={()=>setOpen(false)}
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>

          </div>

        </form>

      </div>

    </div>
  );

}