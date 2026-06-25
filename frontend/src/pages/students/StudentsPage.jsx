import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import { selectCurrentUser } from "../../features/auth/authSlice.js";
import { ROLES } from "../../constants/roles.js";



export default function StudentsPage() {
  const user = useSelector(selectCurrentUser);

  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;
    loadCampuses();
  }, [user]);

  useEffect(() => {
    if (!selectedCampus) return;
    loadStudents();
  }, [selectedCampus, page]);

  const loadCampuses = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/campuses");

      const campusList = data.data || [];

      setCampuses(campusList);

      if (user.role === ROLES.CAMPUS_COORDINATOR) {
        setSelectedCampus(user.campus);
      } else if (campusList.length > 0) {
        setSelectedCampus(campusList[0].campusName);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load campuses"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users", {
        params: {
          role: ROLES.STUDENT,
          campus: selectedCampus,
          page,
          limit: 10,
        },
      });

      setStudents(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (student) => {
  const confirmed = window.confirm(
    `Delete ${student.name}?\n\nThis action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    const res = await api.delete(`/users/${student._id}`);
    // console.log(res);

    setStudents(prev => {
      // console.log(prev);
      return prev.filter(s => s._id !== student._id);
    });

    toast.success("Student deleted successfully");

  } catch (error) {
    // console.log(error);
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Unable to delete student"
    );
  }
};
  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Students
        </p>

        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-slate-950">
          Student Registry
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          View and manage students across campuses.
        </p>

      </section>

      {/* Student List */}
      <section className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

        {user.role === ROLES.DEAN_EITP && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">

            {campuses.map((campus) => (
              <button
                key={campus._id}
                onClick={() => {
                  setPage(1);
                  setSelectedCampus(campus.campusName);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCampus === campus.campusName
                    ? "bg-slate-950 text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {campus.campusName}
              </button>
            ))}

          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading students...
          </p>
        ) : (
          <div className="grid gap-4">
                        {students.map((student) => (
              <div
                key={student._id}
                className="rounded-2xl border border-slate-200 p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  {/* Student Details */}
                  <div className="min-w-0">

                    <p className="font-semibold text-base sm:text-lg text-slate-950">
                      {student.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600 break-all">
                      {student.personalEmail}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {student.branch || "No Branch"}
                      </span>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        Year {student.yearOfStudy || "-"}
                      </span>

                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        {student.studentId}
                      </span>

                    </div>

                  </div>

                  {/* Role Badge */}
                  <div className="flex flex-col items-end gap-3">

  <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
    Student
  </span>

  <button
    onClick={() => deleteStudent(student)}
    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
  >
    Delete
  </button>

</div>

                </div>
              </div>
            ))}

            {students.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No students found.
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-slate-700">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </section>
    </div>
  );
}