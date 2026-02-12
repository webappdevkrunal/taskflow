import { useUnit } from "effector-react";
import ProjectSidebar from "./components/ProjectSidebar";
import CreateTask from "./components/CreateTask";
import TaskBoard from "./components/TaskBoard";
import TaskFilter from "./components/TaskFilter";
import { $activeProjectId, $projects } from "./model/project.store";
import { $taskCounters, $tasksByActiveProject } from "./model/task.store";

export default function BoardPage() {
  const [projects, activeProjectId, counters, tasksForProject] = useUnit([
    $projects,
    $activeProjectId,
    $taskCounters,
    $tasksByActiveProject,
  ]);

  const activeProjectName =
    activeProjectId === null
      ? null
      : (projects.find((p) => p.id === activeProjectId)?.name ?? null);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-350 grid-cols-1 lg:grid-cols-[320px_1fr]">
        <ProjectSidebar />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Board
              </div>
              <div className="truncate text-lg font-semibold text-slate-900">
                {activeProjectName ?? "No project selected"}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <TaskFilter />

              <div className="flex flex-wrap gap-2">
                <CounterChip label="Total" value={counters.total} />
                <CounterChip label="Pending" value={counters.pending} />
                <CounterChip label="In Progress" value={counters.inProgress} />
                <CounterChip label="Done" value={counters.done} />
              </div>
            </div>
          </header>

          <CreateTask />

          {activeProjectId === null ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
              Select or create a project to see tasks.
            </div>
          ) : tasksForProject.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
              No tasks in this project yet. Create one above.
            </div>
          ) : (
            <TaskBoard />
          )}
        </main>
      </div>
    </div>
  );
}

function CounterChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-sm ring-1 ring-slate-200">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <span className="min-w-6 text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}
