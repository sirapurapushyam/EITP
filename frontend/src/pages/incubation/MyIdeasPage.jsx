import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";


import {
  fetchMyIdeas
} from "../../features/incubation/incubationSlice";

import IdeaCard from "../../components/incubation/IdeaCard";

export default function MyIdeasPage() {

  const dispatch = useDispatch();

  const ideas = useSelector(
    state => state.incubation.ideas
  );

  useEffect(() => {
    dispatch(fetchMyIdeas());
  }, [dispatch]);

  return (

    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            My Ideas
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your incubation ideas
          </p>

        </div>

        <Link
          to="/incubation/new"
          className="
            inline-flex
            items-center
            justify-center
            rounded-2xl
            bg-blue-600
            px-5
            py-3
            text-white
            font-medium
            shadow
            hover:bg-blue-700
            transition
          "
        >
          + Submit Idea
        </Link>

      </div>

      {/* Empty state */}
      {ideas.length === 0 ? (

        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
          "
        >

             <div className="flex justify-center mb-4">
  <Lightbulb
    size={64}
    className="text-amber-500"
    strokeWidth={1.8}
  />
</div>


          <h2 className="text-xl font-semibold text-slate-800">
            No ideas submitted yet
          </h2>

          <p className="mt-2 text-slate-500">
            Start by submitting your first idea.
          </p>

          <Link
            to="/incubation/new"
            className="
              mt-6
              inline-flex
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-white
              font-medium
              hover:bg-blue-700
            "
          >
            Submit Idea
          </Link>

        </div>

      ) : (

        <div className="space-y-5">

          {ideas.map(idea => (

            <IdeaCard
              key={idea._id}
              idea={idea}
            />

          ))}

        </div>

      )}

    </div>

  );

}