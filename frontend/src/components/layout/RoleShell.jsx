import { useState,useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { logoutUser, selectCurrentUser } from '../../features/auth/authSlice.js';
import { clearDashboard } from '../../features/dashboard/dashboardSlice.js';
import { clearNotifications } from '../../features/notifications/notificationsSlice.js';
import { ROLES } from '../../constants/roles.js';
// import AnnouncementBanner from '../../pages/announcements/AnnouncementBanner.jsx'
import { Menu, X } from "lucide-react";


const navMap = {
  [ROLES.DEAN_EITP]: [
    'dashboard',
    // 'campuses',
    'students',
    'interns',
    'events',
    'jobs',
    'placements',
    'incubation',
    // 'analytics',
    'chat',
    'announcements',
    // 'notifications',
    'profile'
  ],

  [ROLES.CAMPUS_COORDINATOR]: [
    'dashboard',
    'students',
    'interns',
    'events',
    'jobs',
    // 'tasks',
    'placements',
    'incubation',
    'chat',
    'announcements',
    // 'notifications',
    'profile'
  ],

  [ROLES.STUDENT_INTERN]: [
    'dashboard',
    'events',
    'jobs',
    'placements',
    // 'entrepreneurship',
    'incubation',
    // 'tasks',
    // 'notifications',
    'announcements',
    'chat',
    'profile'
  ],

  [ROLES.STUDENT]: [
    'dashboard',
    'events',
    'jobs',
    'placements',
    // 'entrepreneurship',
    'incubation',
    // 'notifications',
    'announcements',
    'profile'
  ]
};

const navLabels = {
  dashboard: 'Dashboard',
  campuses: 'Campuses',
  students: 'Students',
  interns: 'Interns',
  events: 'Events',
  jobs: 'Jobs',
  placements: 'Placements',
  analytics: 'Analytics',
  chat: 'Chat',
  notifications: 'Notifications',
  announcements: "Announcements",
  profile: 'Profile',
  tasks: 'Tasks',
  // attendance: 'Attendance',
  entrepreneurship: 'Entrepreneurship',
  incubation: 'Incubation'
};


export default function RoleShell({ title }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const items = navMap[user?.role] || [];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    dispatch(clearDashboard());
    dispatch(clearNotifications());
    if (logoutUser.fulfilled.match(result)) {
      toast.success('Logged out');
      navigate('/login', { replace: true });
      return;
    }
    toast.error(result.payload || 'Logout failed');
  };
  let pageTitle;

if (location.pathname.includes('/events/')) {
  pageTitle = 'Event Details';
}
else if (location.pathname.includes('/jobs/')) {
  pageTitle = 'Job Details';
}
else if (location.pathname === '/incubation') {
  pageTitle = 'Incubation';
}
else if (location.pathname === '/incubation/new') {
  pageTitle = 'Submit Idea';
}
else if (
  location.pathname.startsWith('/incubation/')
) {
  pageTitle = 'Idea Details';
}
else {
  const path = location.pathname.split('/')[1];
  pageTitle = navLabels[path] || title;
}
useEffect(() => {
  setSidebarOpen(false);
}, [location.pathname]);
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.18),_transparent_35%),linear-gradient(180deg,#09111f_0%,#0f172a_100%)] text-slate-50">
      <div className="mx-auto flex h-screen max-w-[1600px] gap-6 p-4 lg:p-6 overflow-hidden">
               {
  sidebarOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )
}
        <aside
  className={`
    fixed top-0 left-0 z-50
    h-full w-72
    border border-white/10
    bg-slate-900 p-5 shadow-glow
    transition-transform duration-300

    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }

    lg:translate-x-0
    lg:static
    lg:h-full
    lg:flex
    lg:flex-col
    lg:shrink-0
    lg:rounded-3xl
    lg:bg-white/5
    lg:backdrop-blur-xl
  `}
>
          <div className="mb-8 flex items-center justify-between">
          <button
  className="lg:hidden p-1"
  onClick={() => setSidebarOpen(false)}
>
  <X size={28} />
</button>
            <p className="font-display text-2xl font-semibold tracking-tight">EITP</p>
            <p className="text-sm text-slate-300">Management System</p>
          </div>
          <nav className="flex flex-1 flex-col gap-2 text-sm">
            {items.map((item) => (
              <NavLink
  key={item}
  to={`/${item}`}
  onClick={() => setSidebarOpen(false)}
  className={({ isActive }) =>
    `rounded-2xl px-4 py-3 transition ${
      isActive
        ? "bg-amber text-ink font-semibold"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`
  }
>
  {navLabels[item] || item.charAt(0).toUpperCase() + item.slice(1)}
</NavLink>
            ))}
          </nav>
          <div className="mt-4 space-y-3">
            <Link
  to="/profile"
  onClick={() => setSidebarOpen(false)}
  className="block rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
>
              {user?.name || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Logout
            </button>
          </div>
        </aside>
 

        <main className="flex h-full flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#f6f2ea] text-slate-900 shadow-2xl">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:px-8">
<div className="flex items-center gap-4">

 <button
  className="lg:hidden p-1"
  onClick={() => setSidebarOpen(true)}
>
  <Menu size={32} />
</button>
  <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{title}</p>
              {/* <h1 className="font-display text-2xl font-semibold text-slate-950">{navLabels[location.pathname.split('/')[1]] || title}</h1> */}
              <h1 className="font-display text-2xl font-semibold text-slate-950">
  {pageTitle}
</h1>
</div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/announcements" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Announcements
              </Link>
              <Link to="/profile" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Profile
              </Link>
              <div className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">{user?.role}</div>
            </div>
          </header>
          <div className="flex-1 min-h-0 overflow-y-auto p-5 lg:p-8">
    <Outlet />
</div>
        </main>
      </div>
    </div>
  );
}
