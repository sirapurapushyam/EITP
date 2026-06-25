export default function StatusChip({ status }) {

  let styles =
    "bg-slate-100 text-slate-700";

  switch (status) {

    case "SUBMITTED":
      styles =
        "bg-yellow-100 text-yellow-800";
      break;

    case "COORDINATOR_APPROVED":
      styles =
        "bg-blue-100 text-blue-800";
      break;

    case "DEAN_APPROVED":
      styles =
        "bg-green-100 text-green-800";
      break;

    case "COORDINATOR_REJECTED":
    case "DEAN_REJECTED":
      styles =
        "bg-red-100 text-red-800";
      break;

    case "COMPLETED":
      styles =
        "bg-emerald-100 text-emerald-800";
      break;

    default:
      styles =
        "bg-slate-100 text-slate-700";

  }

  return (

    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        uppercase
        tracking-wide
        ${styles}
      `}
    >

      {status
        ?.replaceAll("_", " ")
        .toLowerCase()}

    </span>

  );

}