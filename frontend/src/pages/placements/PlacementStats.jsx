export default function PlacementStats({ stats }) {

  if (!stats) return null;

  return (

    <div className="grid md:grid-cols-3 gap-5">

      <div className="border rounded-xl p-5">

        <h2 className="text-gray-500">
          Total Placed
        </h2>

        <h1 className="text-3xl font-bold">
          {stats.totalPlaced}
        </h1>

      </div>

      <div className="border rounded-xl p-5">

        <h2 className="text-gray-500">
          Companies
        </h2>

        <h1 className="text-3xl font-bold">
          {stats.byCompany?.length || 0}
        </h1>

      </div>

      <div className="border rounded-xl p-5">

        <h2 className="text-gray-500">
          Campuses
        </h2>

        <h1 className="text-3xl font-bold">
          {stats.byCampus?.length || 0}
        </h1>

      </div>

    </div>

  );
}