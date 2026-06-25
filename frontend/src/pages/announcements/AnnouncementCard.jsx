import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Trash2,
  X,
  Paperclip,
  User,
} from "lucide-react";

import {
  removeAnnouncement,
} from "../../features/announcements/announcementSlice";

import {
  deleteAnnouncementApi,
  dismissAnnouncementApi,
} from "../../features/announcements/announcementApi";

export default function AnnouncementCard({
  announcement,
}) {

  const dispatch = useDispatch();

  const user = useSelector(
    state => state.auth.user
  );

  const isSender =
    announcement.sender?._id === user._id;

  async function handleDelete() {

    try {

      await deleteAnnouncementApi(
        announcement._id
      );

      dispatch(
        removeAnnouncement(
          announcement._id
        )
      );

      toast.success(
        "Announcement deleted."
      );

    }
    catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Delete failed."
      );

    }

  }

  async function handleDismiss() {

    try {

      await dismissAnnouncementApi(
        announcement._id
      );

      dispatch(
        removeAnnouncement(
          announcement._id
        )
      );

    }
    catch {

      toast.error(
        "Unable to remove announcement."
      );

    }

  }

  function audienceColor(audience) {

    switch (audience) {

      case "ALL":
        return "bg-slate-100 text-slate-700";

      case "ALL_STUDENTS":
      case "CAMPUS_STUDENTS":
        return "bg-blue-100 text-blue-700";

      case "ALL_INTERNS":
      case "CAMPUS_INTERNS":
        return "bg-green-100 text-green-700";

      case "ALL_COORDINATORS":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  }

  const createdAt =
    new Date(
      announcement.createdAt
    ).toLocaleString();

  return (

<div
className="
bg-white
rounded-2xl
border
shadow-sm
p-5
space-y-4
transition
hover:shadow-md
"
>

<div
className="
flex
justify-between
items-start
"
>

<div
className="
flex
gap-3
"
>

<div
className="
h-12
w-12
rounded-full
bg-blue-100
flex
items-center
justify-center
"
>

<User
size={22}
className="text-blue-600"
/>

</div>

<div>

<h3
className="
font-semibold
text-slate-800
"
>

{
announcement.sender?.name ||
"Unknown User"
}

</h3>

<p
className="
text-xs
text-slate-500
"
>

{
announcement.sender?.role
?.replaceAll("_"," ")
}

</p>

</div>

</div>

<div
className="
flex
gap-2
"
>

{
isSender ? (

<button
onClick={handleDelete}
className="
p-2
rounded-lg
hover:bg-red-50
text-red-500
"
title="Delete"
>

<Trash2 size={18}/>

</button>

) : (

<button
onClick={handleDismiss}
className="
p-2
rounded-lg
hover:bg-slate-100
text-slate-500
"
title="Remove"
>

<X size={18}/>

</button>

)

}

</div>

</div>

<div
className="
flex
items-center
gap-2
"
>

<Bell
size={18}
className="text-blue-600"
/>

<h2
className="
font-bold
text-lg
text-slate-800
"
>

{
announcement.title
}

</h2>

</div>

<p
className="
text-slate-600
leading-7
"
>

{
announcement.message
}

</p>

<div
className="
flex
flex-wrap
gap-2
"
>

<span
className={`
px-3
py-1
rounded-full
text-xs
font-medium
${audienceColor(
announcement.audience
)}
`}
>

{
announcement.audience
.replaceAll("_"," ")
}

</span>

{
announcement.campus && (

<span
className="
px-3
py-1
rounded-full
bg-orange-100
text-orange-700
text-xs
font-medium
"
>

{
announcement.campus
}

</span>

)

}

</div>

{
announcement.attachments?.length > 0 && (

<div
className="
space-y-2
"
>

{
announcement.attachments.map(
(file,index)=>(

<a
key={index}
href={file.url}
target="_blank"
rel="noreferrer"
className="
flex
items-center
gap-2
text-blue-600
hover:underline
"
>

<Paperclip
size={16}
/>

{
file.fileName ||
"Attachment"
}

</a>

))
}

</div>

)
}

<div
className="
flex
justify-between
items-center
text-xs
text-slate-400
pt-2
border-t
"
>

<span>

{
createdAt
}

</span>

<span>

{
announcement.sender?.role ===
"DEAN_EITP"

? "Dean Announcement"

: "Campus Coordinator"

}

</span>

</div>

</div>

  );

}