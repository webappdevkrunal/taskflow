import { useUnit } from "effector-react";
import { $activeProjectId, $projects, deleteProject, setActiveProject } from "../model/project.store";
import CreateProject from "./CreateProject";

export default function ProjectSidebar() {
  const [projects, activeProjectId, setActiveProjectFn, deleteProjectFn] = useUnit([
    $projects,
    $activeProjectId,
    setActiveProject,
    deleteProject,
  ]);

  return (
    <aside className="flex h-full flex-col gap-4 border-r border-slate-200 bg-white/80 p-4 backdrop-blur shadow-sm transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-900">TaskFlow</div>
      </div>

      <CreateProject />

      <div className="flex-1 overflow-auto">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Projects
        </div>

        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-600">
            No projects yet. Create one to start.
          </div>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => {
              const isActive = p.id === activeProjectId;
              return (
                <li key={p.id}>
                  <div
                    className={[
                      "group flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm shadow-sm transition",
                      isActive
                        ? "border-indigo-200 bg-indigo-50 text-indigo-900"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate text-left cursor-pointer"
                      onClick={() => setActiveProjectFn({ projectId: p.id })}
                      aria-current={isActive ? "page" : undefined}
                      title={p.name}
                    >
                      {p.name}
                    </button>

                    <button
                      type="button"
                      className="cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      onClick={() => deleteProjectFn({ projectId: p.id })}
                      aria-label={`Delete project ${p.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => setActiveProjectFn({ projectId: null })}
        disabled={activeProjectId === null}
      >
        Clear selection
      </button>
    </aside>
  );
}

