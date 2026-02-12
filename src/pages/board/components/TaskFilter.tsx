import { useUnit } from "effector-react";
import type { TaskPriority } from "../types";
import { $priorityFilter, setPriorityFilter } from "../model/task.store";

const PRIORITY_OPTIONS: Array<"All" | TaskPriority> = ["All", "Low", "Medium", "High"];

export default function TaskFilter() {
  const [priority, setPriorityFilterFn] = useUnit([$priorityFilter, setPriorityFilter]);

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium text-slate-700">Priority</div>
      <select
        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition duration-150 focus:border-slate-300 focus:ring-2 focus:ring-indigo-100"
        value={priority}
        onChange={(e) => {
          const value = e.target.value;
          const next = PRIORITY_OPTIONS.find((o) => o === value) ?? "All";
          setPriorityFilterFn({ priority: next });
        }}
        aria-label="Priority filter"
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

