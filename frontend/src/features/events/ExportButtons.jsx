import api from "../../api/axios";

export default function ExportButtons({
  eventId
}) {
  return (
    <div className="flex gap-3">

      <button
        className="rounded-xl bg-blue-600 px-4 py-2 text-white"
        onClick={() =>
          window.open(
            `${api.defaults.baseURL}/exports/events/${eventId}/pdf`
          )
        }
      >
        PDF
      </button>

      <button
        className="rounded-xl bg-green-600 px-4 py-2 text-white"
        onClick={() =>
          window.open(
            `${api.defaults.baseURL}/exports/events/${eventId}/excel`
          )
        }
      >
        Excel
      </button>

    </div>
  );
}