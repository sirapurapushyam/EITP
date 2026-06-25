import { Announcement } from "../models/announcement.model.js";
import { getIO } from "../sockets/index.js";

export async function createAnnouncement(payload) {
  // Save announcement
  const createdAnnouncement = await Announcement.create(payload);

  // Populate sender details
  const announcement = await Announcement.findById(
    createdAnnouncement._id
  ).populate("sender", "name role campus");

  const io = getIO();

  if (!io) {
    return announcement;
  }

  switch (announcement.audience) {
    case "ALL":
      io.emit("new_announcement", announcement);
      break;

    case "ALL_STUDENTS":
      io.to("role:STUDENT").emit(
        "new_announcement",
        announcement
      );
      break;

    case "ALL_INTERNS":
      io.to("role:STUDENT_INTERN").emit(
        "new_announcement",
        announcement
      );
      break;

    case "ALL_COORDINATORS":
      io.to("role:CAMPUS_COORDINATOR").emit(
        "new_announcement",
        announcement
      );
      break;

    case "CAMPUS_STUDENTS":
      io.to(
        `campus:${announcement.campus}:STUDENT`
      ).emit(
        "new_announcement",
        announcement
      );
      break;

    case "CAMPUS_INTERNS":
      io.to(
        `campus:${announcement.campus}:INTERN`
      ).emit(
        "new_announcement",
        announcement
      );
      break;

    default:
      break;
  }

  return announcement;
}