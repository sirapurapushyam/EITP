import DashboardSection from "./DashboardSection";

export default function UpcomingEventsCard({
  events = []
}) {
  return (
    <DashboardSection title="Upcoming Events">

      <div className="space-y-4">

        {events.length === 0 && (
          <p className="text-slate-500">
            No upcoming events
          </p>
        )}

        {events.map((event) => (

          <div
            key={event._id}
            className="rounded-2xl border p-4"
          >

            <h3 className="font-semibold">
              {event.title}
            </h3>

            <p className="text-sm text-slate-500">
              {new Date(
                event.eventDate
              ).toLocaleDateString()}
            </p>

          </div>

        ))}

      </div>

    </DashboardSection>
  );
}