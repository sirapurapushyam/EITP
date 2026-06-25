import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { selectCurrentUser } from '../../features/auth/authSlice';
import ChangePasswordForm from './ChangePasswordForm';

export default function StudentProfileForm() {

  const user = useSelector(selectCurrentUser);

  const {
    register,
    handleSubmit
  } = useForm({
    defaultValues: {
      ...user,
      skills: user.skills?.join(', ')
    }
  });

  async function onSubmit(values) {

    try {

      const payload = {
        name: values.name,
        phone: values.phone,
        branch: values.branch,
        yearOfStudy: values.yearOfStudy,
        batchYear: values.batchYear,
        passedOutYear: values.passedOutYear,
        linkedinProfile: values.linkedinProfile,
        githubProfile: values.githubProfile,
        skills:
          values.skills
            .split(',')
            .map(x => x.trim())
            .filter(Boolean)
      };

      const { data } = await api.patch(
        '/users/me',
        payload
      );

      toast.success(data.message);

    } catch (error) {
      toast.error(
        error.response?.data?.message
      );
    }
  }

  return (
    <>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 md:grid-cols-2 rounded-3xl border bg-white p-6"
    >

      <Field label="Name" register={register('name')} />

      <Field label="Phone" register={register('phone')} />

      <Field
        label="Student ID"
        register={register('studentId')}
        disabled
      />

      <Field
        label="College Email"
        register={register('collegeEmail')}
        disabled
      />

      <Field
        label="Personal Email"
        register={register('personalEmail')}
        disabled
      />

      <Field
        label="Campus"
        register={register('campus')}
        disabled
      />

      <Field
        label="Branch"
        register={register('branch')}
      />

      <Field
        label="Year Of Study"
        register={register('yearOfStudy')}
      />

      <Field
        label="Batch Year"
        type="number"
        register={register('batchYear')}
      />

      <Field
        label="Passed Out Year"
        type="number"
        register={register('passedOutYear')}
      />

      <Field
        label="LinkedIn"
        register={register('linkedinProfile')}
      />

      <Field
        label="Github"
        register={register('githubProfile')}
      />

      <div className="md:col-span-2">

        <label className="block">

          <p className="mb-2">
            Skills
          </p>

          <textarea
            {...register('skills')}
            className="w-full rounded-xl border p-3"
          />

        </label>

      </div>

      <div className="md:col-span-2">

        <button className="rounded-xl bg-slate-950 px-5 py-3 text-white">

          Save Profile

        </button>

      </div>

    </form>
     <ChangePasswordForm />
    </>
  );
}

function Field({
  label,
  register,
  type = 'text',
  disabled = false
}) {
  return (
    <label>
      <p className="mb-2">{label}</p>

      <input
        type={type}
        disabled={disabled}
        {...register}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}