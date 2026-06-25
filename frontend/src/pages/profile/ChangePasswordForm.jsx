import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../api/axios';

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);

  async function onSubmit(values) {
    try {
      setLoading(true);

      await api.post('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      toast.success(
        'Password updated successfully. Please login again.'
      );

      reset();

      // Optional
      // localStorage.removeItem("eitp_access_token");
      // window.location.href = "/login";

    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to update password'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-3xl border bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Change Password
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <PasswordField
          label="Current Password"
          register={register('currentPassword', {
            required: 'Current password is required'
          })}
          error={errors.currentPassword?.message}
        />

        <PasswordField
          label="New Password"
          register={register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 8,
              message:
                'Password must be at least 8 characters'
            }
          })}
          error={errors.newPassword?.message}
        />

        <PasswordField
          label="Confirm Password"
          register={register('confirmPassword', {
            required: 'Confirm your password',
            validate: value =>
              value === watch('newPassword') ||
              'Passwords do not match'
          })}
          error={errors.confirmPassword?.message}
        />

        <button
          disabled={loading}
          className="rounded-xl bg-slate-950 px-5 py-3 text-white disabled:opacity-60"
        >
          {loading
            ? 'Updating...'
            : 'Update Password'}
        </button>
      </form>
    </div>
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
      <p className="mb-2">{label}</p>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          {...register}
          className="w-full rounded-xl border p-3 pr-12"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          {show ? <FiEyeOff /> : <FiEye />}
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