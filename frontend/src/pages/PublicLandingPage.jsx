import { Link } from 'react-router-dom';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.2),_transparent_35%),linear-gradient(180deg,#09111f_0%,#0f172a_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 lg:px-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">EITP</p>
            <p className="text-sm text-slate-300">
              Entrepreneurship, Incubation, Training and Placement Cell
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="rounded-2xl bg-amber px-4 py-2 text-sm font-semibold text-ink"
              to="/register"
            >
              Register
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="grid gap-10 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
              Rajiv Gandhi University of Knowledge Technologies
            </p>

            <h1 className="font-display text-5xl font-semibold leading-tight lg:text-7xl">
              Entrepreneurship, Incubation, Training and Placement Cell
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              A unified platform connecting all RGUKT campuses to foster
              innovation, entrepreneurship, training, and placement activities.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950"
                to="/login"
              >
                Login
              </Link>

              <Link
                className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10"
                to="/register"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Campuses Card */}
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
            <div className="rounded-3xl bg-white p-6 text-slate-950">
              <p className="text-sm font-medium text-slate-500">
                RGUKT Campuses
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <CampusTile campus="RGUKT Srikakulam" />
                <CampusTile campus="RGUKT Nuzvid" />
                <CampusTile campus="RGUKT Ongole" />
                <CampusTile campus="RGUKT RK Valley" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function CampusTile({ campus }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{campus}</p>
    </div>
  );
}