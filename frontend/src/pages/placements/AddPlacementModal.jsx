import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../api/axios";
import { createPlacement } from "../../features/placements/placementSlice";

export default function AddPlacementModal({ open, setOpen }) {

  const dispatch = useDispatch();

  const [studentId, setStudentId] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);

  const [form, setForm] = useState({
    student: "",
    company: "",
    role: "",
    jobType: "FullTime",
    workMode: "InOffice",
    package: "",
    dateOfOffer: ""
  });

  if (!open) return null;

  const handleSearchStudent = async () => {

    if (!studentId.trim()) return;

    try {

      const { data } = await api.get(
        `/users/search?studentId=${studentId}`
      );

      setStudentInfo(data.data);

      setForm((prev) => ({
        ...prev,
        student: data.data._id
      }));

    } catch (error) {

      setStudentInfo(null);

      alert(
        error.response?.data?.message ||
        "Student not found"
      );

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.student) {
      alert("Please search and select a student");
      return;
    }

    await dispatch(createPlacement(form));

    setForm({
      student: "",
      company: "",
      role: "",
      jobType: "FullTime",
      workMode: "InOffice",
      package: "",
      dateOfOffer: ""
    });

    setStudentInfo(null);
    setStudentId("");

    setOpen(false);

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl p-6 w-[550px]">

        <h2 className="text-2xl font-bold mb-6">
          Add Placement
        </h2>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >

          {/* Student Search */}
          <div>

            <label className="block mb-2 font-medium">
              Student ID
            </label>

            <div className="flex gap-2">

              <input
                className="border p-2 rounded w-full"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) =>
                  setStudentId(e.target.value)
                }
              />

              <button
                type="button"
                onClick={handleSearchStudent}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Search
              </button>

            </div>

          </div>

          {/* Student Info */}
          {studentInfo && (

            <div className="border rounded p-4 bg-gray-50">

              <p>
                <strong>Name:</strong>{" "}
                {studentInfo.name}
              </p>

              <p>
                <strong>Student ID:</strong>{" "}
                {studentInfo.studentId}
              </p>

              <p>
                <strong>Branch:</strong>{" "}
                {studentInfo.branch}
              </p>

              <p>
                <strong>Campus:</strong>{" "}
                {studentInfo.campus}
              </p>

            </div>

          )}

          {/* Company */}
          <input
            className="border p-2 rounded w-full"
            placeholder="Company Name"
            value={form.company}
            onChange={(e) =>
              setForm({
                ...form,
                company: e.target.value
              })
            }
          />

          {/* Role */}
          <input
            className="border p-2 rounded w-full"
            placeholder="Role"
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value
              })
            }
          />

          {/* Job Type */}
          <select
            className="border p-2 rounded w-full"
            value={form.jobType}
            onChange={(e) =>
              setForm({
                ...form,
                jobType: e.target.value
              })
            }
          >
            <option value="Internship">
              Internship
            </option>

            <option value="FullTime">
              Full Time
            </option>

            <option value="Intern+FullTime">
              Intern + Full Time
            </option>
          </select>

          {/* Work Mode */}
          <select
            className="border p-2 rounded w-full"
            value={form.workMode}
            onChange={(e) =>
              setForm({
                ...form,
                workMode: e.target.value
              })
            }
          >
            <option value="Remote">
              Remote
            </option>

            <option value="Hybrid">
              Hybrid
            </option>

            <option value="InOffice">
              In Office
            </option>
          </select>

          {/* Package */}
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Package (LPA)"
            value={form.package}
            onChange={(e) =>
              setForm({
                ...form,
                package: e.target.value
              })
            }
          />

          {/* Offer Date */}
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={form.dateOfOffer}
            onChange={(e) =>
              setForm({
                ...form,
                dateOfOffer: e.target.value
              })
            }
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              className="border px-4 py-2 rounded"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Placement
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}