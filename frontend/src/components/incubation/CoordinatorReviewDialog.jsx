import { useEffect, useState } from "react";

export default function CoordinatorReviewDialog({
  open,
  onClose,
  onSubmit,
  title
}) {

  const [remarks, setRemarks] = useState("");

  useEffect(() => {

    if (!open) {
      setRemarks("");
    }

  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {

    onSubmit(remarks);

    setRemarks("");

  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">

          <h2 className="text-2xl font-bold text-slate-800">
            {title}
          </h2>

        </div>

        {/* Body */}
        <div className="p-6">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Remarks
          </label>

          <textarea
            rows={5}
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            placeholder="Enter remarks..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              resize-none
              focus:border-blue-500
            "
          />

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

          <button
            onClick={onClose}
            className="
              rounded-2xl
              border
              border-slate-300
              px-5
              py-2.5
              font-medium
              text-slate-700
              hover:bg-slate-100
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              rounded-2xl
              bg-blue-600
              px-5
              py-2.5
              font-medium
              text-white
              hover:bg-blue-700
              transition
            "
          >
            Submit
          </button>

        </div>

      </div>

    </div>

  );

}