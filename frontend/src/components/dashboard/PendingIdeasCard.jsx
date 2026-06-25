import DashboardSection from "./DashboardSection";

export default function PendingIdeasCard({
  ideas = []
}) {
  return (
    <DashboardSection title="Pending Incubation Ideas">

      <div className="space-y-4">

        {ideas.length === 0 && (
          <p className="text-slate-500">
            No pending ideas
          </p>
        )}

        {ideas.map((idea) => (

          <div
            key={idea._id}
            className="rounded-2xl border p-4"
          >

            <h3 className="font-semibold">
              {idea.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {idea.submittedBy?.name}
            </p>

            <p className="text-sm text-slate-500">
              {idea.campus}
            </p>

          </div>

        ))}

      </div>

    </DashboardSection>
  );
}
