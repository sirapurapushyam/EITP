// services/chatPermission.service.js

import { ROLES } from "../constants/roles.js";

export function canChat(sender, receiver) {

    // Students have no chat access
    if (
        sender.role === ROLES.STUDENT ||
        receiver.role === ROLES.STUDENT
    ) {
        return false;
    }

    // Dean
    if (sender.role === ROLES.DEAN_EITP) {
        return [
            ROLES.CAMPUS_COORDINATOR,
            ROLES.STUDENT_INTERN
        ].includes(receiver.role);
    }

    // Coordinator
    if (sender.role === ROLES.CAMPUS_COORDINATOR) {

        // Coordinator ↔ Dean
        if (receiver.role === ROLES.DEAN_EITP)
            return true;

        // Coordinator ↔ Intern of same campus
        if (
            receiver.role === ROLES.STUDENT_INTERN &&
            receiver.campus === sender.campus
        ) {
            return true;
        }

        return false;
    }

    // Intern
    if (sender.role === ROLES.STUDENT_INTERN) {

        // Intern ↔ Dean
        if (receiver.role === ROLES.DEAN_EITP)
            return true;

        // Intern ↔ own coordinator
        if (
            receiver.role === ROLES.CAMPUS_COORDINATOR &&
            receiver.campus === sender.campus
        ) {
            return true;
        }

        return false;
    }

    return false;
}