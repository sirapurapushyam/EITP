import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Lightbulb } from "lucide-react";

import {
  fetchCoordinatorIdeas,
  coordinatorApprove,
  coordinatorReject
} from "../../features/incubation/incubationSlice";

import IdeaCard from "../../components/incubation/IdeaCard";
import CoordinatorReviewDialog from "../../components/incubation/CoordinatorReviewDialog";

export default function CoordinatorIdeasPage() {

  const dispatch = useDispatch();

  const ideas = useSelector(
    state => state.incubation.ideas
  );

  const [selectedIdea, setSelectedIdea] =
    useState(null);

  const [mode, setMode] =
    useState("");

  useEffect(() => {

    dispatch(
      fetchCoordinatorIdeas()
    );

  }, [dispatch]);

  const handleSubmit = (remarks) => {

    if (mode === "approve") {

      dispatch(
        coordinatorApprove({
          id: selectedIdea._id,
          body: { remarks }
        })
      );

    } else {

      dispatch(
        coordinatorReject({
          id: selectedIdea._id,
          body: { remarks }
        })
      );

    }

    setSelectedIdea(null);

  };

  return (

    <div className="space-y-6">

      {/* Header */}
      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Pending Ideas
        </h1>

        <p className="mt-2 text-slate-500">
          Review and approve student ideas.
        </p>

      </div>

      {/* Empty State */}
      {

        ideas.length === 0 ? (

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
              No ideas waiting for approval
            </h2>

          </div>

        ) : (

          <div className="space-y-5">

            {

              ideas.map(idea => (

                <IdeaCard
                  key={idea._id}
                  idea={idea}
                  showActions
                  onApprove={() => {

                    setSelectedIdea(idea);
                    setMode("approve");

                  }}
                  onReject={() => {

                    setSelectedIdea(idea);
                    setMode("reject");

                  }}
                />

              ))

            }

          </div>

        )

      }

      <CoordinatorReviewDialog
        open={Boolean(selectedIdea)}
        onClose={() =>
          setSelectedIdea(null)
        }
        onSubmit={handleSubmit}
        title={
          mode === "approve"
            ? "Approve Idea"
            : "Reject Idea"
        }
      />

    </div>

  );

}