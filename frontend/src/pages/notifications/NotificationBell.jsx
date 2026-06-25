import { useSelector } from "react-redux";

export default function NotificationBell() {

  const notifications = useSelector(
    state => state.notifications.items
  );

  const unreadCount =
    notifications.filter(
      x => !x.isRead
    ).length;

  return (

    <div className="relative">

      🔔

      {
        unreadCount > 0 && (

          <div
            className="
            absolute
            -top-2
            -right-2
            h-5
            w-5
            rounded-full
            bg-red-500
            text-white
            text-xs
            flex
            items-center
            justify-center
            "
          >

            {unreadCount}

          </div>

        )
      }

    </div>

  );

}