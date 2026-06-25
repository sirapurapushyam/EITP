import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { selectCurrentUser } from "../../features/auth/authSlice";
import { ROLES } from "../../constants/roles";

import EventCard from "../../features/events/EventCard";
import EventForm from "../../features/events/EventForm";

import { listEvents } from "../../features/events/eventService";

export default function EventsPage() {
  const user = useSelector(selectCurrentUser);

  const [events, setEvents] = useState([]);

  async function load() {
    try {
      const data = await listEvents();

      console.log("Loaded events:", data);

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events:", err);
      setEvents([]);
    }
  }

 useEffect(() => {
  load();

  function reloadEvents() {
    load();
  }

  window.addEventListener(
    "event-created",
    reloadEvents
  );

  return () =>
    window.removeEventListener(
      "event-created",
      reloadEvents
    );
}, []);

  return (
    <div className="space-y-8">
      {(user?.role === ROLES.DEAN_EITP ||
        user?.role === ROLES.CAMPUS_COORDINATOR) && (
        <EventForm
          user={user}
          reload={load}
        />
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {events
          .filter(Boolean)
          .map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={user}
            />
          ))}
      </div>
    </div>
  );
}