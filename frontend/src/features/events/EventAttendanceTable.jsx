import toast from "react-hot-toast";
import { markAttendance } from "./eventService";

export default function EventAttendanceTable({
  eventId,
  students = [],
  reload
}) {
  async function updateAttendance(
    studentId,
    status
  ) {
    try {
      await markAttendance(
        eventId,
        studentId,
        status
      );

      toast.success("Attendance updated");

      reload?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update attendance"
      );
    }
  }

  if (!students.length) {
    return (
      <div className="rounded-xl border p-4 text-center text-slate-500">
        No students found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Student ID</th>
            <th className="p-3 text-left">Branch</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Campus</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((item) => (
            <tr
              key={item._id}
              className="border-t"
            >
              <td className="p-3">
                {item.student.name}
              </td>

              <td className="p-3">
                {item.student.studentId}
              </td>

              <td className="p-3">
                {item.student.branch}
              </td>

              <td className="p-3">
                {item.student.phone}
              </td>

              <td className="p-3">
                {item.student.campus}
              </td>

              <td className="p-3">
                {item.attendanceStatus ===
                "Present" ? (
                  <span className="rounded bg-green-100 px-3 py-1 text-green-700">
                    Present
                  </span>
                ) : item.attendanceStatus ===
                  "Absent" ? (
                  <span className="rounded bg-red-100 px-3 py-1 text-red-700">
                    Absent
                  </span>
                ) : (
                  <span className="rounded bg-yellow-100 px-3 py-1 text-yellow-700">
                    Pending
                  </span>
                )}
              </td>

              <td className="p-3">
                {item.attendanceStatus ===
                "Pending" ? (
                  <div className="space-x-2">
                    <button
                      className="rounded bg-green-600 px-3 py-1 text-white"
                      onClick={() =>
                        updateAttendance(
                          item.student._id,
                          "Present"
                        )
                      }
                    >
                      Present
                    </button>

                    <button
                      className="rounded bg-red-600 px-3 py-1 text-white"
                      onClick={() =>
                        updateAttendance(
                          item.student._id,
                          "Absent"
                        )
                      }
                    >
                      Absent
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-500">
                    Attendance Marked
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}