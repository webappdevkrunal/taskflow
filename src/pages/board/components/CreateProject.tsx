import { useUnit } from "effector-react";
import {
  $projectName,
  createProject,
  projectNameChanged,
} from "../model/project.store";

export default function CreateProject() {
  const [name, createProjectFn, changeName] = useUnit([
    $projectName,
    createProject,
    projectNameChanged,
  ]);

  const canSubmit = name.trim().length > 0;

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        createProjectFn({ name });
        changeName("");
      }}
    >
      <input
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition duration-150 focus:border-slate-300 focus:ring-2 focus:ring-indigo-100"
        value={name}
        onChange={(e) => changeName(e.target.value)}
        placeholder="New project name..."
        aria-label="Project name"
      />
      <button
        type="submit"
        className="shrink-0 cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 hover:-translate-y-px hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={!canSubmit}
      >
        Add
      </button>
    </form>
  );
}
