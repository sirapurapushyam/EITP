import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    
    <div className="min-h-screen bg-cream px-4 py-10 text-slate-950">
      
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 lg:grid-cols-2">
        {/* Left Side */}
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#09111f,#0f2440_45%,#1d4ed8)] p-8 text-white shadow-glow lg:p-10">
          <p className="font-display text-3xl font-semibold">
            EITP Management System
          </p>

          <p className="mt-6 max-w-md text-slate-300">
            Entrepreneurship, Incubation, Training and Placement Cell
            connecting students, coordinators, and administrators across
            all RGUKT campuses.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <MiniCard
              label="Campus"
              value="RGUKT Srikakulam"
            />

            <MiniCard
              label="Campus"
              value="RGUKT Nuzvid"
            />

            <MiniCard
              label="Campus"
              value="RGUKT Ongole"
            />

            <MiniCard
              label="Campus"
              value="RGUKT RK Valley"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="font-display text-3xl font-semibold">
              {title}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {subtitle}
            </p>

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}