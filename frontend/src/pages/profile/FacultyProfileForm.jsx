import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { selectCurrentUser } from '../../features/auth/authSlice';
import ChangePasswordForm from './ChangePasswordForm';

export default function FacultyProfileForm() {

  const user = useSelector(selectCurrentUser);

  const {
    register,
    handleSubmit
  } = useForm({
    defaultValues: user
  });

  async function onSubmit(values) {

    try {

      const payload = {
        name: values.name,
        phone: values.phone,
        designation: values.designation
      };

      const { data } =
        await api.patch('/users/me', payload);

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
      className="grid gap-4 rounded-3xl border bg-white p-6"
    >

      <Field
        label="Name"
        register={register('name')}
      />

      <Field
        label="Phone"
        register={register('phone')}
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
        label="Designation"
        register={register('designation')}
      />

      <button className="rounded-xl bg-slate-950 py-3 text-white">
        Save Profile
      </button>

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