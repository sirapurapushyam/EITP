import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();

 const onSubmit = async (values) => {
  try {
    await api.post('/auth/forgot-password', values);

    toast.success(
      'Password reset link sent. Please check your email.'
    );

    setTimeout(() => {
      navigate('/login');
    }, 1500);

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      'Unable to send reset link'
    );
  }
};

  const navigate = useNavigate();

  return (
    <AuthLayout title="Forgot password" subtitle="Request a password reset link.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" type="email" register={register('email', { required: true })} />
        <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white">Send reset link</button>
      </form>
      <div className="mt-4 text-sm text-slate-600">
        <Link to="/login" className="font-medium text-slate-950">Back to sign in</Link>
      </div>
    </AuthLayout>
  );
}

function Field({ label, register, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input type={type} {...register} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cobalt" />
    </label>
  );
}
