import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const {
  register,
  watch,
  handleSubmit,
  formState: { errors }
} = useForm();

const onSubmit = async (values) => {
  const {
    confirmPassword,
    ...payload
  } = values;

  payload.skills = payload.skills
    ? payload.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean)
    : [];

  const result = await dispatch(registerUser(payload));

  if (registerUser.fulfilled.match(result)) {
    toast.success('Account created successfully');
    navigate('/login');
  } else {
    toast.error(result.payload || 'Registration failed');
  }
};

  return (
   <AuthLayout
  title="Create Account"
  subtitle="Join the EITP platform and become part of the RGUKT community."
>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <Input
          label="Full Name"
          register={register('name', {
            required: 'Name is required'
          })}
          error={errors.name?.message}
        />

        <Input
  label="Personal Email"
  type="email"
  register={register('personalEmail', {
    required: 'Personal email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid email address'
    }
  })}
  error={errors.personalEmail?.message}
/>

       <Input
  label="College Email"
  type="email"
  register={register('collegeEmail', {
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid college email'
    }
  })}
  error={errors.collegeEmail?.message}
/>

        <Input
  label="Phone"
  register={register('phone', {
    required: 'Phone number is required',
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Enter a valid 10-digit mobile number'
    }
  })}
  error={errors.phone?.message}
/>

        <Input
  label="Student ID"
  register={register('studentId', {
    required: 'Student ID is required',
    minLength: {
      value: 5,
      message: 'Student ID is too short'
    }
  })}
  error={errors.studentId?.message}
/>

        <label className="block">
  <span className="mb-2 block text-sm font-medium text-slate-700">
    Campus
  </span>

  <select
    {...register('campus', {
      required: 'Campus is required'
    })}
    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cobalt"
  >
    <option value="">Select Campus</option>
    <option value="RGUKT Srikakulam">RGUKT Srikakulam</option>
    <option value="RGUKT Nuzvid">RGUKT Nuzvid</option>
    <option value="RGUKT Ongole">RGUKT Ongole</option>
    <option value="RGUKT RK Valley">RGUKT RK Valley</option>
  </select>

  {errors.campus && (
    <p className="mt-1 text-sm text-red-500">
      {errors.campus.message}
    </p>
  )}
</label>

      <label className="block">
  <span className="mb-2 block text-sm font-medium text-slate-700">
    Branch
  </span>

  <select
    {...register('branch')}
    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cobalt"
  >
    <option value="">Select Branch</option>
    <option value="CSE">CSE</option>
    <option value="ECE">ECE</option>
    <option value="EEE">EEE</option>
    <option value="MECH">MECH</option>
    <option value="CIVIL">CIVIL</option>
    <option value="CHEMICAL">CHEMICAL</option>
    <option value="METALLURGY">METALLURGY</option>
  </select>
</label>

       <label className="block">
  <span className="mb-2 block text-sm font-medium text-slate-700">
    Year Of Study
  </span>

  <select
    {...register('yearOfStudy')}
    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
  >
    <option value="">Select Year</option>
    <option value="E1">E1</option>
    <option value="E2">E2</option>
    <option value="E3">E3</option>
    <option value="E4">E4</option>
  </select>
</label>

       <Input
  label="Batch Year"
  type="number"
  register={register('batchYear', {
    valueAsNumber: true,
    min: {
      value: 2008,
      message: 'Invalid batch year'
    },
    max: {
      value: 2050,
      message: 'Invalid batch year'
    }
  })}
  error={errors.batchYear?.message}
/>

      <Input
  label="Passed Out Year"
  type="number"
  register={register('passedOutYear', {
    valueAsNumber: true,
    min: {
      value: 2013,
      message: 'Invalid year'
    },
    max: {
      value: 2060,
      message: 'Invalid year'
    }
  })}
  error={errors.passedOutYear?.message}
/>

        <Input
  label="LinkedIn Profile"
  register={register('linkedinProfile', {
    pattern: {
      value: /^https:\/\/(www\.)?linkedin\.com\/.*$/,
      message: 'Enter a valid LinkedIn URL'
    }
  })}
  error={errors.linkedinProfile?.message}
/>

        <Input
  label="GitHub Profile"
  register={register('githubProfile', {
    pattern: {
      value: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
      message: 'Enter a valid GitHub URL'
    }
  })}
  error={errors.githubProfile?.message}
/>

        <Input
          label="Skills (comma separated)"
          register={register('skills')}
        />

        <Input
  label="Password"
  type="password"
  register={register('password', {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Minimum 8 characters'
    },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      message:
        'Must contain uppercase, lowercase, number and special character'
    }
  })}
  error={errors.password?.message}
/>
<Input
  label="Confirm Password"
  type="password"
  register={register('confirmPassword', {
    required: 'Confirm your password',
    validate: value =>
      value === watch('password') ||
      'Passwords do not match'
  })}
  error={errors.confirmPassword?.message}
/>

        <button
          className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-slate-950"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

function Input({
  label,
  register,
  type = 'text',
  error
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          type={
            isPassword
              ? showPassword
                ? 'text'
                : 'password'
              : type
          }
          {...register}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-cobalt"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
          >
            {showPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </label>
  );
}