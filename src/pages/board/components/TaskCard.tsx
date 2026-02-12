import { useUnit } from "effector-react";
import type { Task, TaskPriority, TaskStatus } from "../types";
import {
  deleteTask,
  updateTaskPriority,
  updateTaskStatus,
} from "../model/task.store";

export interface TaskCardProps {
  task: Task;
}

const STATUSES: TaskStatus[] = ["Pending", "In Progress", "Done"];
const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];

function priorityBadgeClass(priority: TaskPriority): string {
  if (priority === "High")
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  if (priority === "Medium")
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
}

export default function TaskCard({ task }: TaskCardProps) {
  const [deleteTaskFn, updateStatusFn, updatePriorityFn] = useUnit([
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
  ]);

  const isHigh = task.priority === "High";

  return (
    <div
      className={[
        "rounded-xl border bg-white p-4 shadow-sm",
        isHigh ? "border-rose-200" : "border-slate-200",
      ].join(" ")}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className="truncate text-sm font-semibold text-slate-900"
            title={task.title}
          >
            {task.title}
          </div>
          {task.description.trim().length > 0 ? (
            <div className="mt-1 line-clamp-3 text-sm text-slate-600">
              {task.description}
            </div>
          ) : (
            <div className="mt-1 text-sm text-slate-400">No description</div>
          )}
        </div>

        <span
          className={[
            "shrink-0 rounded-full px-2 py-1 text-xs font-semibold",
            priorityBadgeClass(task.priority),
          ].join(" ")}
          title={task.priority}
        >
          {task.priority}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <div className="text-xs font-semibold text-slate-500">Status</div>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-indigo-100"
            value={task.status}
            onChange={(e) => {
              const value = e.target.value;
              const next = STATUSES.find((s) => s === value) ?? task.status;
              updateStatusFn({ taskId: task.id, status: next });
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-xs font-semibold text-slate-500">Priority</div>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-indigo-100"
            value={task.priority}
            onChange={(e) => {
              const value = e.target.value;
              const next = PRIORITIES.find((p) => p === value) ?? task.priority;
              updatePriorityFn({ taskId: task.id, priority: next });
            }}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
          onClick={() => deleteTaskFn({ taskId: task.id })}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
