import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loginUser } from "../../features/auth/authSlice.js";
import { ROLES } from "../../constants/roles.js";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../features/auth/authSlice";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const handleGoogle = async (credentialResponse) => {
    const result = await dispatch(googleLogin(credentialResponse.credential));

    if (googleLogin.fulfilled.match(result)) {
      if (result.payload.profileCompleted) {
        toast.success("Welcome " + result.payload.user.name);

        navigate("/student");
      } else {
        navigate("/complete-profile", {
          state: {
            user: result.payload.user,
          },
        });
      }
    } else {
      toast.error(result.payload);
    }
  };

  const onSubmit = async (values) => {
    setSubmitting(true);

    const result = await dispatch(loginUser(values));

    setSubmitting(false);

    if (loginUser.fulfilled.match(result)) {
      const user = result.payload.user;

      if (user.role === ROLES.CAMPUS_COORDINATOR && !user.approved) {
        toast.error("Your account is awaiting Dean approval.");
        return;
      }

      toast.success(`Welcome ${user.name}`);

      switch (user.role) {
        case ROLES.DEAN_EITP:
          navigate("/dean");
          break;

        case ROLES.CAMPUS_COORDINATOR:
          navigate("/coordinator");
          break;

        case ROLES.STUDENT_INTERN:
          navigate("/intern");
          break;

        default:
          navigate("/student");
      }
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <AuthShell title="Sign in" subtitle="Access your EITP workspace.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field
          label="Email"
          type="email"
          register={register("loginId", {
            required: "Email is required",
          })}
          error={errors.loginId?.message}
        />

        <Field
          label="Password"
          type="password"
          register={register("password", {
            required: "Password is required",
          })}
          error={errors.password?.message}
        />

        <button
          disabled={submitting}
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <div className="my-5 flex items-center">
          <div className="h-px flex-1 bg-slate-300" />

          <span className="mx-4 text-sm">OR</span>

          <div className="h-px flex-1 bg-slate-300" />
        </div>

        <GoogleLogin
          onSuccess={handleGoogle}
          onError={() => toast.error("Google Login Failed")}
        />
      </form>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <Link to="/forgot-password" className="hover:text-slate-950">
          Forgot password?
        </Link>

        <Link to="/register" className="hover:text-slate-950">
          Create student account
        </Link>
      </div>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-cream px-4 py-10 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 lg:grid-cols-2">
        {/* Left Section */}
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#09111f,#0f2440_45%,#1d4ed8)] p-8 text-white shadow-glow lg:p-10">
          <p className="font-display text-3xl font-semibold">
            EITP Management System
          </p>

          <p className="mt-6 max-w-md text-slate-300">
            Entrepreneurship, Incubation, Training and Placement Cell serving
            all RGUKT campuses through a unified platform for students,
            coordinators, and administrators.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <MiniCard label="Campus" value="RGUKT Srikakulam" />
            <MiniCard label="Campus" value="RGUKT Nuzvid" />
            <MiniCard label="Campus" value="RGUKT Ongole" />
            <MiniCard label="Campus" value="RGUKT RK Valley" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="font-display text-3xl font-semibold">{title}</h1>

            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

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

      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({ label, register, type = "text", error }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...register}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-cobalt"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </label>
  );
}
