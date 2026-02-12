import { useUnit } from "effector-react";
import { $activeProjectId } from "../model/project.store";
import {
  $taskDescriptionInput,
  $taskPriorityInput,
  $taskTitleInput,
  addTask,
  taskDescriptionChanged,
  taskPriorityChanged,
  taskTitleChanged,
} from "../model/task.store";
import type { TaskPriority } from "../types";

const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];

export default function CreateTask() {
  const [
    activeProjectId,
    title,
    description,
    priority,
    addTaskFn,
    changeTitle,
    changeDescription,
    changePriority,
  ] = useUnit([
    $activeProjectId,
    $taskTitleInput,
    $taskDescriptionInput,
    $taskPriorityInput,
    addTask,
    taskTitleChanged,
    taskDescriptionChanged,
    taskPriorityChanged,
  ]);

  const isDisabled = activeProjectId === null;
  const canSubmit = !isDisabled && title.trim().length > 0;

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit || activeProjectId === null) return;
        addTaskFn({
          projectId: activeProjectId,
          title,
          description,
          priority,
        });
        changeTitle("");
        changeDescription("");
        changePriority("Medium");
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">Create task</div>
        {isDisabled ? (
          <div className="text-xs font-medium text-slate-500">
            Select a project to add tasks
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600">
            Title
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={title}
            onChange={(e) => changeTitle(e.target.value)}
            placeholder="e.g. Design landing page"
            disabled={isDisabled}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600">
            Description
          </label>
          <textarea
            className="mt-1 min-h-21 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={description}
            onChange={(e) => changeDescription(e.target.value)}
            placeholder="Optional details..."
            disabled={isDisabled}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600">
            Priority
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={priority}
            onChange={(e) => {
              const value = e.target.value;
              const next = PRIORITIES.find((p) => p === value) ?? "Medium";
              changePriority(next);
            }}
            disabled={isDisabled}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 md:w-auto"
            disabled={!canSubmit}
          >
            Add task
          </button>
        </div>
      </div>
    </form>
  );
}
