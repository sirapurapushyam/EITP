import { ROLES } from "../constants/roles.js";
import { Announcement } from "../models/announcement.model.js";
import { createAnnouncement } from "../services/announcement.service.js";

export async function sendAnnouncement(req, res, next) {
  try {
    const sender = req.user;

    if (
      sender.role !== ROLES.DEAN_EITP &&
      sender.role !== ROLES.CAMPUS_COORDINATOR
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = {
      title: req.body.title,
      message: req.body.message,
      audience: req.body.audience,
      campus: req.body.campus || null,
      attachments: req.body.attachments || [],
      sender: sender._id,
    };

    // Coordinator permissions
    if (sender.role === ROLES.CAMPUS_COORDINATOR) {
      if (
        payload.audience !== "CAMPUS_STUDENTS" &&
        payload.audience !== "CAMPUS_INTERNS"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Coordinators can only send to their campus students or interns.",
        });
      }

      // Force coordinator campus
      payload.campus = sender.campus;
    }

    // Dean validation
    if (
      sender.role === ROLES.DEAN_EITP &&
      payload.audience.startsWith("CAMPUS") &&
      !payload.campus
    ) {
      return res.status(400).json({
        success: false,
        message: "Campus is required.",
      });
    }

    const announcement = await createAnnouncement(payload);

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAnnouncements(req, res, next) {
  try {
    let filter = {};

    switch (req.user.role) {
      case ROLES.STUDENT:
        filter = {
          $or: [
            { audience: "ALL" },
            { audience: "ALL_STUDENTS" },
            {
              audience: "CAMPUS_STUDENTS",
              campus: req.user.campus,
            },
          ],
        };
        break;

      case ROLES.STUDENT_INTERN:
        filter = {
          $or: [
            { audience: "ALL" },
            { audience: "ALL_INTERNS" },
            {
              audience: "CAMPUS_INTERNS",
              campus: req.user.campus,
            },
          ],
        };
        break;

      case ROLES.CAMPUS_COORDINATOR:
        filter = {
          $or: [
            { audience: "ALL" },
            { audience: "ALL_COORDINATORS" },
          ],
        };
        break;

      case ROLES.DEAN_EITP:
        filter = {};
        break;
    }

    const announcements = await Announcement.find({
      ...filter,
      dismissedBy: {
        $ne: req.user._id,
      },
    })
      .populate("sender", "name role campus")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    next(err);
  }
}

export async function dismissAnnouncement(req, res, next) {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    announcement.dismissedBy.addToSet(req.user._id);

    await announcement.save();

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAnnouncement(req, res, next) {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    if (
      announcement.sender.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your announcements.",
      });
    }

    await announcement.deleteOne();

    res.json({
      success: true,
      message: "Announcement deleted.",
    });
  } catch (err) {
    next(err);
  }
}