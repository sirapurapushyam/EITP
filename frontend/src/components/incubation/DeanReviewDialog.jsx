import { useEffect, useState } from "react";

export default function DeanReviewDialog({
  open,
  onClose,
  onSubmit
}) {

  const [remarks, setRemarks] =
    useState("");

  const [fundAmount, setFundAmount] =
    useState("");

  useEffect(() => {

    if (!open) {

      setRemarks("");
      setFundAmount("");

    }

  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {

    onSubmit({
      remarks,
      fundAmount
    });

  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">

          <h2 className="text-2xl font-bold text-slate-800">
            Dean Approval
          </h2>

        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Remarks
            </label>

            <textarea
              rows={4}
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-blue-500
              "
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Fund Amount
            </label>

            <input
              type="number"
              value={fundAmount}
              onChange={(e) =>
                setFundAmount(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-blue-500
              "
            />

          </div>

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
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              rounded-2xl
              bg-green-600
              px-5
              py-2.5
              font-medium
              text-white
              hover:bg-green-700
            "
          >
            Approve
          </button>

        </div>

      </div>

    </div>

  );

}