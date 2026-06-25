export default function NotificationCard({
  notification
}) {

  return (

    <div
      className="
      bg-white
      rounded-2xl
      p-5
      shadow-sm
      border
      "
    >

      <h3 className="font-semibold text-slate-800">

        {notification.title}

      </h3>

      <p className="mt-2 text-slate-600">

        {notification.message}

      </p>

      <div className="mt-4 text-xs text-gray-400">

        {
          new Date(
            notification.createdAt
          ).toLocaleString()
        }

      </div>

    </div>

  );

}