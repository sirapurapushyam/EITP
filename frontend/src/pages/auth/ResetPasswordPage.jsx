import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await api.post(
        `/auth/reset-password/${token}`,
        {
          password: values.password
        }
      );

      toast.success(
        'Password updated successfully.'
      );

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to reset password'
      );
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <PasswordField
          label="New Password"
          register={register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message:
                'Password must be at least 8 characters'
            }
          })}
          error={errors.password?.message}
        />

        <PasswordField
          label="Confirm Password"
          register={register('confirmPassword', {
            required: 'Confirm password',
            validate: value =>
              value === watch('password') ||
              'Passwords do not match'
          })}
          error={errors.confirmPassword?.message}
        />

        <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white">
          Reset Password
        </button>
      </form>

      <div className="mt-5 text-center text-sm">
        <Link
          to="/login"
          className="font-medium text-slate-900"
        >
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}

function PasswordField({
  label,
  register,
  error
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          {...register}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-cobalt"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        >
          {show ? (
            <FiEyeOff size={20} />
          ) : (
            <FiEye size={20} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </label>
  );
}