import { useUnit } from "effector-react";
import type { TaskStatus } from "../types";
import { $filteredTasks } from "../model/task.store";
import TaskCard from "./TaskCard";

export default function TaskColumn({ status }: { status: TaskStatus }) {
  const tasks = useUnit($filteredTasks);
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <section className="flex min-h-80 flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <header className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">{status}</div>
        <div className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
          {columnTasks.length}
        </div>
      </header>

      {columnTasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
          No tasks here.
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          {columnTasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </section>
  );
}
