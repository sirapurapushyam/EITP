import { useState } from "react";
import toast from "react-hot-toast";
import { createEvent } from "./eventService";
import { ROLES } from "../../constants/roles";

const CAMPUS_OPTIONS = [
  "RGUKT Srikakulam",
  "RGUKT Nuzvid",
  "RGUKT Ongole",
  "RGUKT RK Valley",
];

export default function EventForm({ user, reload }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    registrationDeadline: "",
    eventTime: "",
    numberOfDays: 1,
    targetType: "ALL_CAMPUSES",
    targetCampuses: [],
    image: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCampusChange(e) {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setForm((prev) => ({
      ...prev,
      targetCampuses: values,
    }));
  }
  function handleCampusCheckbox(e) {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      targetCampuses: checked
        ? [...prev.targetCampuses, value]
        : prev.targetCampuses.filter((c) => c !== value),
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("eventDate", form.eventDate);
      formData.append("registrationDeadline", form.registrationDeadline);
      formData.append("eventTime", form.eventTime);
      formData.append("numberOfDays", form.numberOfDays);
      formData.append("targetType", form.targetType);

      // Dean selected campuses
      if (
        user.role === ROLES.DEAN_EITP &&
        form.targetType === "SPECIFIC_CAMPUSES"
      ) {
        formData.append("targetCampuses", JSON.stringify(form.targetCampuses));
      }

      // Coordinator specific campus = own campus
      if (
        user.role === ROLES.CAMPUS_COORDINATOR &&
        form.targetType === "SPECIFIC_CAMPUSES"
      ) {
        formData.append("targetCampuses", user.campus);
      }

      if (form.image) {
        formData.append("image", form.image);
      }

      await createEvent(formData);

      toast.success("Event created successfully");

      setForm({
        title: "",
        description: "",
        eventDate: "",
        registrationDeadline: "",
        eventTime: "",
        numberOfDays: 1,
        targetType: "ALL_CAMPUSES",
        targetCampuses: [],
        image: null,
      });

      reload?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border p-6 bg-white"
    >
      <div>
        <label className="mb-1 block font-medium">Event Title</label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Description</label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Event Date</label>

        <input
          type="date"
          name="eventDate"
          value={form.eventDate}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Registration Deadline</label>

        <input
          type="date"
          name="registrationDeadline"
          value={form.registrationDeadline}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Event Time</label>

        <input
          type="text"
          name="eventTime"
          value={form.eventTime}
          onChange={handleChange}
          placeholder="10:00 AM"
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Number Of Days</label>

        <input
          type="number"
          min="1"
          name="numberOfDays"
          value={form.numberOfDays}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
      </div>

      {/* Target Audience */}
      <div>
        <label className="font-semibold">Target Audience</label>

        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="targetType"
              value="ALL_CAMPUSES"
              checked={form.targetType === "ALL_CAMPUSES"}
              onChange={handleChange}
            />
            All Campuses
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="targetType"
              value="SPECIFIC_CAMPUSES"
              checked={form.targetType === "SPECIFIC_CAMPUSES"}
              onChange={handleChange}
            />
            Selected Campuses
          </label>
        </div>
      </div>
      {/* Dean campus selection */}
      {user.role === ROLES.DEAN_EITP &&
        form.targetType === "SPECIFIC_CAMPUSES" && (
          <div className="mt-4 space-y-2">
            {CAMPUS_OPTIONS.map((campus) => (
              <label key={campus} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={campus}
                  checked={form.targetCampuses.includes(campus)}
                  onChange={handleCampusCheckbox}
                />

                {campus}
              </label>
            ))}
          </div>
        )}
      {/* Coordinator info */}
      {user.role === ROLES.CAMPUS_COORDINATOR &&
        form.targetType === "SPECIFIC_CAMPUSES" && (
          <div className="rounded bg-blue-50 p-3 text-sm text-blue-700">
            Event will be visible only to <strong>{user.campus}</strong>.
          </div>
        )}

      {/* <div>
        <label className="mb-1 block font-medium">
          Event Image
        </label>

        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChange}
          className="w-full"
        />
      </div> */}

      <button
        type="submit"
        className="rounded bg-blue-600 px-5 py-2 text-white"
      >
        Create Event
      </button>
    </form>
  );
}
