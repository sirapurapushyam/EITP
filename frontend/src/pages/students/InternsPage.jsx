import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import { selectCurrentUser } from "../../features/auth/authSlice.js";
import { ROLES } from "../../constants/roles.js";
import Pagination from "../../components/common/Pagination.jsx";

export default function InternsPage() {
  const user = useSelector(selectCurrentUser);

  const [students, setStudents] = useState([]);
  const [interns, setInterns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [studentPage, setStudentPage] = useState(1);
  const [internPage, setInternPage] = useState(1);

  const [studentCount, setStudentCount] = useState(0);
  const [internCount, setInternCount] = useState(0);

  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [internTotalPages, setInternTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user, studentPage, internPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const params = {};

      if (
        user?.role === ROLES.DEAN_EITP &&
        user?.campus
      ) {
        params.campus = user.campus;
      }

      const [studentsResponse, internsResponse] =
        await Promise.all([
          api.get("/users", {
            params: {
              role: ROLES.STUDENT,
              page: studentPage,
              limit: 10,
            },
          }),

          api.get("/users", {
            params: {
              role: ROLES.STUDENT_INTERN,
              page: internPage,
              limit: 10,
            },
          }),
        ]);

      setStudents(studentsResponse.data.data || []);
      setInterns(internsResponse.data.data || []);

      setStudentTotalPages(
        studentsResponse.data.totalPages || 1
      );

      setInternTotalPages(
        internsResponse.data.totalPages || 1
      );

      setStudentCount(
        studentsResponse.data.total || 0
      );

      setInternCount(
        internsResponse.data.total || 0
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const promoteStudent = async (id) => {
    try {
      setBusyId(id);

      const { data } = await api.patch(
        `/users/${id}/promote-intern`
      );

      toast.success(data.message);

      loadUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to promote student"
      );
    } finally {
      setBusyId(null);
    }
  };

  const removeIntern = async (id) => {
    try {
      setBusyId(id);

      const { data } = await api.patch(
        `/users/${id}/remove-intern`
      );

      toast.success(data.message);

      loadUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove intern"
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Intern Management
        </p>

        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-slate-950">
          Promote or Remove Interns
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Manage student interns in your campus.
        </p>

      </section>

      {/* Content */}
      <section className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading...
          </p>
        ) : (
          <div className="space-y-6">

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">

              <button
                onClick={() =>
                  setActiveTab("students")
                }
                className={`shrink-0 rounded-2xl px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold transition ${
                  activeTab === "students"
                    ? "bg-slate-950 text-white"
                    : "border border-slate-300 text-slate-700"
                }`}
              >
                Students ({studentCount})
              </button>

              <button
                onClick={() =>
                  setActiveTab("interns")
                }
                className={`shrink-0 rounded-2xl px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold transition ${
                  activeTab === "interns"
                    ? "bg-slate-950 text-white"
                    : "border border-slate-300 text-slate-700"
                }`}
              >
                Interns ({internCount})
              </button>

            </div>
                        {/* Students Tab */}
            {activeTab === "students" && (
              <>
                <div className="grid gap-4">

                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="rounded-2xl border border-slate-200 p-4 hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        {/* Student Details */}
                        <div className="min-w-0 flex-1">

                          <h3 className="font-semibold text-base sm:text-lg text-slate-900">
                            {student.name}
                          </h3>

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

                            {student.studentId && (
                              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                {student.studentId}
                              </span>
                            )}

                          </div>

                        </div>

                        {/* Promote Button */}
                        <button
                          disabled={busyId === student._id}
                          onClick={() =>
                            promoteStudent(student._id)
                          }
                          className="self-start sm:self-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {busyId === student._id
                            ? "Promoting..."
                            : "Promote"}
                        </button>

                      </div>
                    </div>
                  ))}

                  {students.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                      No students found.
                    </div>
                  )}

                </div>

                <div className="mt-6">
                  <Pagination
                    page={studentPage}
                    totalPages={studentTotalPages}
                    onPageChange={setStudentPage}
                  />
                </div>
              </>
            )}
                        {/* Interns Tab */}
            {activeTab === "interns" && (
              <>
                <div className="grid gap-4">

                  {interns.map((intern) => (
                    <div
                      key={intern._id}
                      className="rounded-2xl border border-slate-200 p-4 hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        {/* Intern Details */}
                        <div className="min-w-0 flex-1">

                          <h3 className="font-semibold text-base sm:text-lg text-slate-900">
                            {intern.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-600 break-all">
                            {intern.personalEmail}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {intern.branch || "No Branch"}
                            </span>

                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                              Year {intern.yearOfStudy || "-"}
                            </span>

                            {intern.studentId && (
                              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                {intern.studentId}
                              </span>
                            )}

                          </div>

                        </div>

                        {/* Remove Button */}
                        <button
                          disabled={busyId === intern._id}
                          onClick={() =>
                            removeIntern(intern._id)
                          }
                          className="self-start sm:self-center rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {busyId === intern._id
                            ? "Removing..."
                            : "Remove"}
                        </button>

                      </div>
                    </div>
                  ))}

                  {interns.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                      No interns found.
                    </div>
                  )}

                </div>

                <div className="mt-6">
                  <Pagination
                    page={internPage}
                    totalPages={internTotalPages}
                    onPageChange={setInternPage}
                  />
                </div>
              </>
            )}

          </div>
        )}
      </section>
    </div>
  );
}