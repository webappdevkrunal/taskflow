import { createEvent, createStore, sample } from "effector";
import type { Project } from "../types";

const STORAGE_KEY_PROJECTS = "taskflow:projects";
const STORAGE_KEY_ACTIVE_PROJECT_ID = "taskflow:activeProjectId";

function safeParseJson(value: string | null): unknown {
  if (value === null) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isProject(value: unknown): value is Project {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.createdAt === "number"
  );
}

function loadProjects(): Project[] {
  const parsed = safeParseJson(localStorage.getItem(STORAGE_KEY_PROJECTS));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isProject);
}

function loadActiveProjectId(): string | null {
  const parsed = safeParseJson(localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT_ID));
  return typeof parsed === "string" ? parsed : null;
}

export const createProject = createEvent<{ name: string }>();
export const deleteProject = createEvent<{ projectId: string }>();
export const setActiveProject = createEvent<{ projectId: string | null }>();

export const projectNameChanged = createEvent<string>();

export const $projectName = createStore<string>("").on(
  projectNameChanged,
  (_, name) => name,
);

const projectCreated = createEvent<Project>();

sample({
  clock: createProject,
  filter: ({ name }) => name.trim().length > 0,
  fn: ({ name }): Project => ({
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: Date.now(),
  }),
  target: projectCreated,
});

export const $projects = createStore<Project[]>(loadProjects())
  .on(projectCreated, (projects, project) => [project, ...projects])
  .on(deleteProject, (projects, { projectId }) =>
    projects.filter((p) => p.id !== projectId),
  );

export const $activeProjectId = createStore<string | null>(loadActiveProjectId())
  .on(setActiveProject, (_, { projectId }) => projectId)
  .on(deleteProject, (activeId, { projectId }) =>
    activeId === projectId ? null : activeId,
  )
  .on(projectCreated, (_, project) => project.id);

// Persistence
$projects.watch((projects) => {
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
});

$activeProjectId.watch((activeProjectId) => {
  if (activeProjectId === null) {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_PROJECT_ID);
    return;
  }
  localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT_ID, JSON.stringify(activeProjectId));
});

