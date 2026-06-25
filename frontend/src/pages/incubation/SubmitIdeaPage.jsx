import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  submitIdea
} from "../../features/incubation/incubationSlice";

export default function SubmitIdeaPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    problemStatement: "",
    solution: "",
    expectedOutcome: "",
    category: ""
  });

  const handleChange = (e) => {

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const result = await dispatch(
      submitIdea(form)
    );

    if (
      submitIdea.fulfilled.match(result)
    ) {

      navigate("/incubation");

    }

  };

  return (

    <div className="mx-auto max-w-4xl">

      <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6 md:p-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Submit New Idea
          </h1>

          <p className="mt-2 text-slate-500">
            Share your innovation and start the incubation process.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Title */}
          <div>

            <label className="block mb-2 text-sm font-medium text-slate-700">
              Idea Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
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

          {/* Description */}
          <div>

            <label className="block mb-2 text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
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

          {/* Problem */}
          <div>

            <label className="block mb-2 text-sm font-medium text-slate-700">
              Problem Statement
            </label>

            <textarea
              rows={3}
              name="problemStatement"
              value={form.problemStatement}
              onChange={handleChange}
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

          {/* Solution */}
          <div>

            <label className="block mb-2 text-sm font-medium text-slate-700">
              Solution
            </label>

            <textarea
              rows={3}
              name="solution"
              value={form.solution}
              onChange={handleChange}
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

          {/* Expected Outcome */}
          <div>

            <label className="block mb-2 text-sm font-medium text-slate-700">
              Expected Outcome
            </label>

            <textarea
              rows={3}
              name="expectedOutcome"
              value={form.expectedOutcome}
              onChange={handleChange}
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

          {/* Category */}
          <div>

            <label className="block mb-2 text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
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

          {/* Submit */}
          <div className="pt-4">

            <button
              type="submit"
              className="
                rounded-2xl
                bg-blue-600
                px-8
                py-3
                text-white
                font-medium
                shadow
                hover:bg-blue-700
                transition
              "
            >
              Submit Idea
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}