import { Navigate, Route, Routes } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, selectCurrentUser,clearAuth } from './features/auth/authSlice.js';
import { ROLES } from './constants/roles.js';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import DashboardRouter from './pages/dashboard/DashboardRouter.jsx';
import PublicLandingPage from './pages/PublicLandingPage.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import {
  connectSocket,
  disconnectSocket
} from "./api/socket";
import {
initializeSocket
}
from "./features/chat/socketListeners";
import { Toaster } from "react-hot-toast";
import GoogleCompleteProfile from "./pages/auth/GoogleCompleteProfile";
function RoleRedirect() {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === ROLES.DEAN_EITP) return <Navigate to="/dean" replace />;
  if (user.role === ROLES.CAMPUS_COORDINATOR) return <Navigate to="/coordinator" replace />;
  if (user.role === ROLES.STUDENT_INTERN) return <Navigate to="/intern" replace />;
  return <Navigate to="/student" replace />;
}


export default function App() {
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);


  const dispatch = useDispatch();
  

  const user = useSelector(
    selectCurrentUser
  );

  useEffect(() => {

    if (
      localStorage.getItem(
        "eitp_access_token"
      )
    ) {

      dispatch(
        fetchCurrentUser()
      );

    } else {

      dispatch(
        clearAuth()
      );

    }

  }, []);

//   useEffect(() => {

//     if (user) {

//       connectSocket();
//       initializeSocket(
// dispatch
// );

//     } else {

//       disconnectSocket();

//     }

//   }, [user]);



useEffect(() => {
  if (user) {
    const socket = connectSocket();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    initializeSocket(dispatch);
  } else {
    disconnectSocket();
  }
}, [user]);

  useEffect(() => {

  if (
    "Notification" in window &&
    Notification.permission !== "granted"
  ) {

    Notification.requestPermission();

  }

}, []);

  return (
  <>
  

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 5000
      }}
    />

    <Routes>

      <Route
        path="/"
        element={<PublicLandingPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPasswordPage />}
      />
      <Route
  path="/complete-profile"
  element={<GoogleCompleteProfile />}
/>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <RoleRedirect />
          </ProtectedRoute>
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />

    </Routes>

  </>
);

}
