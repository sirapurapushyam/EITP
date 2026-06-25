import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { ROLES } from '../../constants/roles';
import StudentProfileForm from './StudentProfileForm';
import FacultyProfileForm from './FacultyProfileForm';

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);

  const isStudent =
    user?.role === ROLES.STUDENT ||
    user?.role === ROLES.STUDENT_INTERN;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">
          My Profile
        </h1>

        <p className="mt-2 text-slate-600">
          Manage your account information.
        </p>
      </section>

      {isStudent ? (
        <StudentProfileForm />
      ) : (
        <FacultyProfileForm />
      )}
    </div>
  );
}