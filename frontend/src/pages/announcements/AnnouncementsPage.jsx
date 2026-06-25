import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { Bell } from "lucide-react";

import {
  fetchAnnouncements,
} from "../../features/announcements/announcementSlice";

import AnnouncementCard from "./AnnouncementCard";
import AnnouncementForm from "./AnnouncementForm";

export default function AnnouncementsPage() {

  const dispatch = useDispatch();

  const {
    items,
    status,
  } = useSelector(
    state => state.announcements
  );

  const user = useSelector(
    state => state.auth.user
  );

  useEffect(() => {

    dispatch(fetchAnnouncements());

  }, [dispatch]);

  const canCreate =
    user?.role === "DEAN_EITP" ||
    user?.role === "CAMPUS_COORDINATOR";

  return (

<div
className="
max-w-7xl
mx-auto
px-4
py-6
"
>

<div
className="
mb-8
"
>

<div
className="
flex
items-center
gap-3
"
>

<div
className="
h-12
w-12
rounded-xl
bg-blue-100
flex
items-center
justify-center
"
>

<Bell
size={24}
className="text-blue-600"
/>

</div>

<div>

<h1
className="
text-3xl
font-bold
text-slate-800
"
>

Announcements

</h1>

<p
className="
text-slate-500
mt-1
"
>

Stay updated with the latest announcements from the Dean and Campus Coordinators.

</p>

</div>

</div>

</div>

<div
className="
grid
lg:grid-cols-3
gap-6
items-start
"
>

{
canCreate && (

<div
className="
lg:sticky
lg:top-6
"
>

<AnnouncementForm/>

</div>

)
}

<div
className={
canCreate
? "lg:col-span-2 space-y-5"
: "lg:col-span-3 space-y-5"
}
>

{
status === "loading" && (

<div
className="
bg-white
rounded-2xl
border
shadow-sm
p-10
text-center
text-slate-500
"
>

Loading announcements...

</div>

)
}

{
status !== "loading" &&
items.length === 0 && (

<div
className="
bg-white
rounded-2xl
border
shadow-sm
p-12
text-center
"
>

<div
className="
mx-auto
mb-4
h-16
w-16
rounded-full
bg-slate-100
flex
items-center
justify-center
"
>

<Bell
size={30}
className="text-slate-500"
/>

</div>

<h2
className="
text-xl
font-semibold
text-slate-700
"
>

No Announcements

</h2>

<p
className="
mt-2
text-slate-500
"
>

You're all caught up.
There are no announcements available.

</p>

</div>

)
}

{
items.map(
announcement => (

<AnnouncementCard
key={announcement._id}
announcement={announcement}
/>

))
}

</div>

</div>

</div>

  );

}