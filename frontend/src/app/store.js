import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import uiReducer from '../features/ui/uiSlice.js';
import dashboardReducer from '../features/dashboard/dashboardSlice.js';
import notificationsReducer from '../features/notifications/notificationsSlice.js';
import placementReducer from "../features/placements/placementSlice";
import chatReducer from "../features/chat/chatSlice";
import announcementReducer from "../features/announcements/announcementSlice";
import incubationReducer from "../features/incubation/incubationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
    placements: placementReducer,
    chat:chatReducer,
    announcements:announcementReducer,
    incubation: incubationReducer,
  }
});
