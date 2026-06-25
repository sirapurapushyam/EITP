import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchNotifications
} from "../../features/notifications/notificationsSlice";

import NotificationCard from "./NotificationCard";

export default function NotificationsPage() {

  const dispatch = useDispatch();

  const notifications = useSelector(
    state => state.notifications.items
  );

  useEffect(() => {

    dispatch(fetchNotifications());

  }, []);

  return (

    <div className="space-y-4">

      {
        notifications.map(notification => (

          <NotificationCard
            key={notification._id}
            notification={notification}
          />

        ))
      }

    </div>

  );

}