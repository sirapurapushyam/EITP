import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  createAnnouncementApi,
} from "../../features/announcements/announcementApi";

import {
  prependAnnouncement,
} from "../../features/announcements/announcementSlice";

const CAMPUSES = [
  "RGUKT Srikakulam",
  "RGUKT Nuzvid",
  "RGUKT Ongole",
  "RGUKT RK Valley",
];

export default function AnnouncementForm() {

  const dispatch = useDispatch();

  const user = useSelector(
    state => state.auth.user
  );

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [audience, setAudience] =
    useState(
      user.role === "DEAN_EITP"
        ? "ALL"
        : "CAMPUS_STUDENTS"
    );

  const [campus, setCampus] =
    useState("");

  /**
   * Audience options
   */
  const audienceOptions = useMemo(() => {

    if (user.role === "DEAN_EITP") {

      return [

        {
          value: "ALL",
          label: "All Users"
        },

        {
          value: "ALL_STUDENTS",
          label: "All Students"
        },

        {
          value: "ALL_INTERNS",
          label: "All Intern Students"
        },

        {
          value: "ALL_COORDINATORS",
          label: "All Coordinators"
        },

        {
          value: "CAMPUS_STUDENTS",
          label: "Specific Campus Students"
        }

      ];

    }

    return [

      {
        value: "CAMPUS_STUDENTS",
        label: "My Campus Students"
      },

      {
        value: "CAMPUS_INTERNS",
        label: "My Campus Intern Students"
      }

    ];

  }, [user.role]);
  async function submit(e) {
  e.preventDefault();

  if (!title.trim()) {
    toast.error("Title is required.");
    return;
  }

  if (!message.trim()) {
    toast.error("Message is required.");
    return;
  }

  if (
    user.role === "DEAN_EITP" &&
    audience === "CAMPUS_STUDENTS" &&
    !campus
  ) {
    toast.error("Please select a campus.");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      title: title.trim(),
      message: message.trim(),
      audience,
    };

    // Dean selects campus
    if (
      user.role === "DEAN_EITP" &&
      audience === "CAMPUS_STUDENTS"
    ) {
      payload.campus = campus;
    }

    const { data } =
      await createAnnouncementApi(payload);

    dispatch(
      prependAnnouncement(data.data)
    );

    toast.success(
      "Announcement sent successfully."
    );

    setTitle("");
    setMessage("");

    if (user.role === "DEAN_EITP") {
      setAudience("ALL");
      setCampus("");
    } else {
      setAudience("CAMPUS_STUDENTS");
    }

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Failed to send announcement."
    );

  } finally {

    setLoading(false);

  }
}
  return (

<form
  onSubmit={submit}
  className="
    bg-white
    rounded-2xl
    border
    shadow-sm
    p-6
    space-y-5
  "
>
<div>

<h2
className="
text-xl
font-bold
text-slate-800
"
>
Create Announcement
</h2>

<p
className="
text-sm
text-slate-500
mt-1
"
>

Send announcements instantly to users.

</p>

</div>

<div>

<label
className="
block
text-sm
font-medium
mb-2
"
>

Title

</label>

<input
value={title}
onChange={e=>setTitle(e.target.value)}
placeholder="Announcement title"
className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"
/>

</div>

<div>

<label
className="
block
text-sm
font-medium
mb-2
"
>

Message

</label>

<textarea
rows={5}
value={message}
onChange={e=>setMessage(e.target.value)}
placeholder="Write announcement..."
className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
resize-none
"
/>

</div>

<div
className="
grid
md:grid-cols-2
gap-4
"
>

<div>

<label
className="
block
text-sm
font-medium
mb-2
"
>

Audience

</label>

<select
value={audience}
onChange={e=>setAudience(e.target.value)}
className="
w-full
rounded-xl
border
px-4
py-3
"
>

{
audienceOptions.map(
option=>(

<option
key={option.value}
value={option.value}
>

{option.label}

</option>

))
}

</select>

</div>
{
user.role==="DEAN_EITP" &&
audience==="CAMPUS_STUDENTS" && (

<div>

<label
className="
block
text-sm
font-medium
mb-2
"
>

Campus

</label>

<select
value={campus}
onChange={e=>setCampus(e.target.value)}
className="
w-full
rounded-xl
border
px-4
py-3
"
>

<option value="">

Select Campus

</option>

{
CAMPUSES.map(
campusName=>(

<option
key={campusName}
value={campusName}
>

{campusName}

</option>

))
}

</select>

</div>

)
}
</div>

{
  user.role === "CAMPUS_COORDINATOR" && (

    <div>

      <label
        className="
          block
          text-sm
          font-medium
          mb-2
        "
      >
        Campus
      </label>

      <input
        value={user.campus}
        disabled
        className="
          w-full
          rounded-xl
          border
          bg-slate-100
          px-4
          py-3
          text-slate-600
        "
      />

    </div>

  )
}
<div className="flex justify-end">

  <button
    type="submit"
    disabled={loading}
    className="
      px-6
      py-3
      rounded-xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      font-medium
      transition
      disabled:opacity-60
      disabled:cursor-not-allowed
    "
  >

    {
      loading
        ? "Sending..."
        : "Send Announcement"
    }

  </button>

</div>

</form>

  )}