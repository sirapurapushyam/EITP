import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectAuthInitialized
} from '../../features/auth/authSlice';

export default function ProtectedRoute({
  children
}) {

  const user = useSelector(selectCurrentUser);
  const initialized = useSelector(
    selectAuthInitialized
  );

  if (!initialized) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}