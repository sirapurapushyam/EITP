import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../../api/axios";
import AuthLayout from "../../components/layout/AuthLayout";
import { hydrateAuth } from "../../features/auth/authSlice";

export default function GoogleCompleteProfile() {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const googleUser = location.state?.user;

  useEffect(() => {

    if (!googleUser) {
      navigate("/login");
    }

  }, [googleUser, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({

    defaultValues: {

      name: googleUser?.name || "",

      personalEmail:
        googleUser?.personalEmail || "",

      collegeEmail: "",

      phone: "",

      studentId: "",

      campus: "",

      branch: "",

      yearOfStudy: "",

      batchYear: "",

      passedOutYear: "",

      linkedinProfile: "",

      githubProfile: "",

      skills: ""

    }

  });

  const [loading, setLoading] =
    useState(false);

  async function onSubmit(values) {

    setLoading(true);

    try {

      const payload = {

        userId: googleUser._id,

        studentId: values.studentId,

        phone: values.phone,

        collegeEmail:
          values.collegeEmail,

        campus: values.campus,

        branch: values.branch,

        yearOfStudy:
          values.yearOfStudy,

        batchYear:
          Number(values.batchYear),

        passedOutYear:
          Number(values.passedOutYear),

        linkedinProfile:
          values.linkedinProfile,

        githubProfile:
          values.githubProfile,
          password: values.password,

        skills: values.skills
          ? values.skills
              .split(",")
              .map(skill => skill.trim())
              .filter(Boolean)
          : []

      };

      const { data } =
        await api.post(
          "/auth/google/complete-profile",
          payload
        );

      dispatch(

        hydrateAuth({

          user: data.user,

          accessToken:
            data.accessToken

        })

      );

      toast.success(
        "Registration completed successfully."
      );

      navigate("/student");

    }
    catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to complete registration"

      );

    }
    finally {

      setLoading(false);

    }

  }

  return (

    <AuthLayout

      title="Complete Your Profile"

      subtitle="Please provide the remaining details to finish your registration."

    >

      <form

        onSubmit={handleSubmit(onSubmit)}

        className="grid gap-4"

      >
              {/* Name */}
        <Input
          label="Full Name"
          disabled
          register={register("name")}
        />

        {/* Personal Email */}
        <Input
          label="Personal Email"
          type="email"
          disabled
          register={register("personalEmail")}
        />

        {/* College Email */}
        <Input
          label="College Email"
          type="email"
          register={register("collegeEmail", {
            required: "College email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email"
            }
          })}
          error={errors.collegeEmail?.message}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          register={register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: "Enter a valid mobile number"
            }
          })}
          error={errors.phone?.message}
        />

        {/* Student ID */}
        <Input
          label="Student ID"
          register={register("studentId", {
            required: "Student ID is required"
          })}
          error={errors.studentId?.message}
        />

        {/* Campus */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Campus
          </span>

          <select
            {...register("campus", {
              required: "Campus is required"
            })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Select Campus</option>
            <option value="RGUKT Srikakulam">
              RGUKT Srikakulam
            </option>
            <option value="RGUKT Nuzvid">
              RGUKT Nuzvid
            </option>
            <option value="RGUKT Ongole">
              RGUKT Ongole
            </option>
            <option value="RGUKT RK Valley">
              RGUKT RK Valley
            </option>
          </select>

          {errors.campus && (
            <p className="mt-1 text-sm text-red-500">
              {errors.campus.message}
            </p>
          )}
        </label>

        {/* Branch */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Branch
          </span>

          <select
            {...register("branch", {
              required: "Branch is required"
            })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="CHEMICAL">CHEMICAL</option>
            <option value="METALLURGY">
              METALLURGY
            </option>
          </select>

          {errors.branch && (
            <p className="mt-1 text-sm text-red-500">
              {errors.branch.message}
            </p>
          )}
        </label>

        {/* Year */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Year Of Study
          </span>

          <select
            {...register("yearOfStudy", {
              required: "Year is required"
            })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Select Year</option>
            <option value="E1">E1</option>
            <option value="E2">E2</option>
            <option value="E3">E3</option>
            <option value="E4">E4</option>
          </select>

          {errors.yearOfStudy && (
            <p className="mt-1 text-sm text-red-500">
              {errors.yearOfStudy.message}
            </p>
          )}
        </label>

        <Input
          label="Batch Year"
          type="number"
          register={register("batchYear", {
            required: "Batch year is required"
          })}
          error={errors.batchYear?.message}
        />

        <Input
          label="Passed Out Year"
          type="number"
          register={register("passedOutYear", {
            required: "Passed out year is required"
          })}
          error={errors.passedOutYear?.message}
        />

        <Input
          label="LinkedIn Profile"
          register={register("linkedinProfile")}
        />

        <Input
          label="GitHub Profile"
          register={register("githubProfile")}
        />
        <Input
  label="Password"
  type="password"
  register={register("password", {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters"
    }
  })}
  error={errors.password?.message}
/>

<Input
  label="Confirm Password"
  type="password"
  register={register("confirmPassword", {
    required: "Confirm your password",
    validate: value =>
      value === watch("password") ||
      "Passwords do not match"
  })}
  error={errors.confirmPassword?.message}
/>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Skills (comma separated)
          </span>

          <textarea
            rows={4}
            {...register("skills")}
            className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-cobalt"
          />
        </label>

        <button
          disabled={loading}
          className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {loading
            ? "Completing..."
            : "Complete Registration"}
        </button>

      </form>

    </AuthLayout>
  );
}
function Input({
  label,
  register,
  type = "text",
  disabled = false,
  error
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const isPassword = type === "password";

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
                ? "text"
                : "password"
              : type
          }
          disabled={disabled}
          autoComplete="off"
          {...register}
          className={`w-full rounded-2xl border px-4 py-3 pr-12 outline-none transition
            ${
              disabled
                ? "cursor-not-allowed bg-slate-100 text-slate-500"
                : "bg-white focus:border-cobalt"
            }
            ${
              error
                ? "border-red-500"
                : "border-slate-200"
            }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
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