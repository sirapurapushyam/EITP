import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../../features/auth/authSlice.js';
import { ROLES } from '../../constants/roles.js';

import RoleShell from '../../components/layout/RoleShell.jsx';

import DeanDashboardPage from './DeanDashboardPage.jsx';
import CoordinatorDashboardPage from './CoordinatorDashboardPage.jsx';
import InternDashboardPage from './InternDashboardPage.jsx';
import StudentDashboardPage from './StudentDashboardPage.jsx';


import NotificationsPage from '../notifications/NotificationsPage.jsx';
import ProfilePage from '../profile/ProfilePage.jsx';

import StudentsPage from '../students/StudentsPage.jsx';
import InternsPage from '../students/InternsPage.jsx';

import TasksPage from '../tasks/TasksPage.jsx';

import EventsPage from '../events/EventsPage.jsx';
import EventDetailsPage from '../events/EventDetailsPage.jsx';

import JobsPage from '../jobs/JobsPage.jsx';
import JobDetailsPage from '../jobs/JobDetailsPage.jsx';
import PlacementsPage from "../placements/PlacementsPage";
import ChatPage from "../chat/ChatPage.jsx";
import AnnouncementsPage from "../announcements/AnnouncementsPage";
import IncubationPage from '../incubation/IncubationPage';
import SubmitIdeaPage from '../incubation/SubmitIdeaPage';
import IdeaDetailsPage from '../incubation/IdeaDetailsPage';


function RoleLanding() {
  const user = useSelector(selectCurrentUser);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === ROLES.DEAN_EITP)
    return <Navigate to="/dean" replace />;

  if (user.role === ROLES.CAMPUS_COORDINATOR)
    return <Navigate to="/coordinator" replace />;

  if (user.role === ROLES.STUDENT_INTERN)
    return <Navigate to="/intern" replace />;

  return <Navigate to="/student" replace />;
}

export default function DashboardRouter() {

  const user = useSelector(selectCurrentUser);

  if (!user)
    return <Navigate to="/login" replace />;

  return (
    <Routes>

      <Route element={<RoleShell title="Dashboard" />}>

        <Route path="/dashboard" element={<RoleLanding />} />

        <Route
          path="/dean"
          element={
            user.role === ROLES.DEAN_EITP
              ? <DeanDashboardPage />
              : <Navigate to="/app" replace />
          }
        />

        <Route
          path="/coordinator"
          element={
            user.role === ROLES.CAMPUS_COORDINATOR
              ? <CoordinatorDashboardPage />
              : <Navigate to="/app" replace />
          }
        />

        <Route
          path="/intern"
          element={
            user.role === ROLES.STUDENT_INTERN
              ? <InternDashboardPage />
              : <Navigate to="/app" replace />
          }
        />

        <Route
          path="/student"
          element={
            user.role === ROLES.STUDENT
              ? <StudentDashboardPage />
              : <Navigate to="/app" replace />
          }
        />


        <Route path="/students" element={<StudentsPage />} />
        <Route path="/interns" element={<InternsPage />} />

        {/* Events */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />

        {/* Jobs */}
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />


<Route
path="/placements"
element={<PlacementsPage />}
/>

        <Route path="/tasks" element={<TasksPage />} />


        <Route
  path="/incubation"
  element={<IncubationPage />}
/>

<Route
  path="/incubation/new"
  element={<SubmitIdeaPage />}
/>

<Route
  path="/incubation/:id"
  element={<IdeaDetailsPage />}
/>

        <Route path="/notifications" element={<NotificationsPage />} />
<Route
path="/announcements"
element={<AnnouncementsPage/>}
/>
        <Route
path="/chat"
element={<ChatPage/>}
/>


        <Route path="/profile" element={<ProfilePage />} />


        <Route path="*" element={<Navigate to="/app" replace />} />

      </Route>

    </Routes>
  );
}