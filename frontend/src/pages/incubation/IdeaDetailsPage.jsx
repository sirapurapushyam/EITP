import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";

import {
  fetchIdeaDetails
} from "../../features/incubation/incubationSlice";

import IdeaTimeline from "../../components/incubation/IdeaTimeline";
import StatusChip from "../../components/incubation/StatusChip";

export default function IdeaDetailsPage() {

  const { id } = useParams();
const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedIdea = useSelector(
    state => state.incubation.selectedIdea
  );

  useEffect(() => {

    dispatch(
      fetchIdeaDetails(id)
    );

  }, [dispatch, id]);

  if (!selectedIdea) {

    return (

      <div className="flex items-center justify-center py-20">

        <div className="text-slate-500">
          Loading...
        </div>

      </div>

    );

  }

  const idea = selectedIdea.idea;

  return (

    <div className="space-y-8">
        {/* Back Button */}
<div>

  <button
    onClick={() => navigate(-1)}
    className="
      inline-flex
      items-center
      gap-2
      rounded-2xl
      border
      border-slate-300
      bg-white
      px-5
      py-3
      text-sm
      font-medium
      text-slate-700
      shadow-sm
      hover:bg-slate-100
      transition
    "
  >
    ← Back
  </button>

</div>

      {/* Main Card */}
      <div className="
        rounded-3xl
        bg-white
        border
        border-slate-200
        shadow-sm
        p-6
        md:p-8
      ">

        <div className="
          flex
          flex-col
          gap-5
          md:flex-row
          md:items-start
          md:justify-between
        ">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              {idea.title}
            </h1>

            <p className="mt-4 text-slate-600 leading-7">
              {idea.description}
            </p>

          </div>

          <StatusChip
            status={idea.status}
          />

        </div>

        <div className="
          mt-8
          grid
          gap-6
          md:grid-cols-2
        ">

          <div>

            <div className="text-xs uppercase tracking-wide text-slate-400">
              Problem Statement
            </div>

            <div className="mt-2 text-slate-700">
              {idea.problemStatement || "-"}
            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-wide text-slate-400">
              Solution
            </div>

            <div className="mt-2 text-slate-700">
              {idea.solution || "-"}
            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-wide text-slate-400">
              Expected Outcome
            </div>

            <div className="mt-2 text-slate-700">
              {idea.expectedOutcome || "-"}
            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-wide text-slate-400">
              Category
            </div>

            <div className="mt-2 text-slate-700">
              {idea.category || "-"}
            </div>

          </div>

        </div>

      </div>

      {/* Timeline */}
      <div className="
        rounded-3xl
        bg-white
        border
        border-slate-200
        shadow-sm
        p-6
      ">

        <h2 className="
          text-2xl
          font-bold
          text-slate-800
          mb-6
        ">
          Timeline
        </h2>

        <IdeaTimeline
          timeline={selectedIdea.timeline}
        />

      </div>

    </div>

  );

}