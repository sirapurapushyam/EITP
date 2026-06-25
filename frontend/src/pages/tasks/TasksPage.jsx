import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { selectCurrentUser } from '../../features/auth/authSlice.js';
import { ROLES } from '../../constants/roles.js';

export default function TasksPage() {
  const user = useSelector(selectCurrentUser);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingTask, setCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Title and due date are required');
      return;
    }

    setCreatingTask(true);
    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        status: 'Pending'
      };
      await api.post('/tasks', payload);
      toast.success('Task created');
      setNewTask({ title: '', description: '', dueDate: '' });
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setCreatingTask(false);
    }
  };

  const canCreateTask = [ROLES.DEAN_EITP, ROLES.CAMPUS_COORDINATOR].includes(user?.role);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Tasks</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">Task management</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          {canCreateTask
            ? 'Create and assign tasks to interns and students. Track completion and deadlines.'
            : 'View your assigned tasks and track your progress.'}
        </p>
      </section>

      {canCreateTask ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-950">Create a new task</h3>
          <form onSubmit={handleCreateTask} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea placeholder="Task description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" rows="3" />
            <button disabled={creatingTask} className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60 md:col-span-2">
              {creatingTask ? 'Creating...' : 'Create task'}
            </button>
          </form>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-slate-950">Tasks list</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Loading tasks...</p>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task) => (
              <div key={task._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="text-sm text-slate-600">{task.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            {!tasks.length ? <p className="text-sm text-slate-500">No tasks assigned yet.</p> : null}
          </div>
        )}
      </section>
    </div>
  );
}
