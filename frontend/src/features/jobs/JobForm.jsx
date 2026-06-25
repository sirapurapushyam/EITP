import { useState } from "react";
import toast from "react-hot-toast";
import { createJob } from "./jobService";
import { ROLES } from "../../constants/roles";

const CAMPUS_OPTIONS = [
  "RGUKT Srikakulam",
  "RGUKT Nuzvid",
  "RGUKT Ongole",
  "RGUKT RK Valley"
];

export default function JobForm({
  user,
  reload
}) {
  const initialState = {
    companyName: "",
    role: "",
    description: "",
    salary: "",
    package: "",
    deadline: "",
    targetType: "ALL_CAMPUSES",
    targetCampuses: []
  };

  const [form, setForm] =
    useState(initialState);

  const [logo, setLogo] =
    useState(null);

 function handleChange(e) {
  const { name, value, files } = e.target;

  if (name === "logo") {
    setLogo(files?.[0] || null);
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
}

function handleCampusCheckbox(e) {
  const { value, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    targetCampuses: checked
      ? [...prev.targetCampuses, value]
      : prev.targetCampuses.filter(
          (c) => c !== value
        ),
  }));
}
  async function submit(e) {
    e.preventDefault();

    try {
      const fd = new FormData();

      Object.entries(form).forEach(
        ([k, v]) => {
          if (k !== "targetCampuses") {
            fd.append(k, v);
          }
        }
      );

     if (
  user.role === ROLES.DEAN_EITP &&
  form.targetType ===
    "SPECIFIC_CAMPUSES"
) {
  fd.append(
    "targetCampuses",
    JSON.stringify(
      form.targetCampuses
    )
  );
}

if (
  user.role ===
    ROLES.CAMPUS_COORDINATOR &&
  form.targetType ===
    "SPECIFIC_CAMPUSES"
) {
  fd.append(
    "targetCampuses",
    user.campus
  );
}

      if (logo) {
        fd.append("logo", logo);
      }

      await createJob(fd);

      toast.success(
        "Job created successfully"
      );

      setForm(initialState);

      setLogo(null);

      reload?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to create job"
      );
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border bg-white p-6"
    >
      <div>
        <label className="mb-1 block font-medium">
          Company Name
        </label>

        <input
          className="w-full rounded border p-3"
          value={form.companyName}
          name="companyName"
onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Role
        </label>

        <input
          className="w-full rounded border p-3"
          name="role"
          value={form.role}
onChange={handleChange}

          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Description
        </label>

        <textarea
          rows="4"
          className="w-full rounded border p-3"
          name="description"
          value={form.description}
          onChange={handleChange}

          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Package / Salary
        </label>

        <input
          className="w-full rounded border p-3"
          value={form.package}
          name="package"
          onChange={handleChange}

        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Application Deadline
        </label>

        <input
          type="date"
          className="w-full rounded border p-3"
          value={form.deadline}
          name="deadline"
          onChange={handleChange}

          required
        />
      </div>

      {/* Target Audience */}

    <div>
  <label className="font-semibold">
    Target Audience
  </label>

  <div className="mt-2 space-y-2">

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="targetType"
        value="ALL_CAMPUSES"
        checked={
          form.targetType ===
          "ALL_CAMPUSES"
        }
        onChange={handleChange}
      />
      All Campuses
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="targetType"
        value="SPECIFIC_CAMPUSES"
        checked={
          form.targetType ===
          "SPECIFIC_CAMPUSES"
        }
        onChange={handleChange}
      />
      Selected Campuses
    </label>

  </div>
</div>
      {/* Dean campus selection */}

      {user.role === ROLES.DEAN_EITP &&
  form.targetType ===
    "SPECIFIC_CAMPUSES" && (

    <div className="mt-4 space-y-2">

      {CAMPUS_OPTIONS.map(
        (campus) => (

          <label
            key={campus}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              value={campus}
              checked={form.targetCampuses.includes(
                campus
              )}
              onChange={
                handleCampusCheckbox
              }
            />

            {campus}

          </label>

        )
      )}

    </div>

)}
      {user.role ===
        ROLES.CAMPUS_COORDINATOR &&
        form.targetType ===
          "SPECIFIC_CAMPUSES" && (
          <div className="rounded bg-blue-50 p-3 text-sm text-blue-700">
            This job will be visible
            only to{" "}
            <strong>
              {user.campus}
            </strong>
          </div>
        )}

      <div>
        {/* <label className="mb-1 block font-medium">
          Company Logo
        </label>

        <input
          type="file"
          onChange={(e) =>
            setLogo(
              e.target.files[0]
            )
          }
        /> */}
      </div>

      <button
        className="rounded bg-slate-900 px-5 py-3 text-white"
      >
        Create Job
      </button>
    </form>
  );
}