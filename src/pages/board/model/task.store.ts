import { combine, createEvent, createStore } from "effector";
import type {
  PriorityFilter,
  Task,
  TaskCounters,
  TaskPriority,
  TaskStatus,
} from "../types";
import { $activeProjectId, deleteProject } from "./project.store";

const STORAGE_KEY_TASKS = "taskflow:tasks";

function safeParseJson(value: string | null): unknown {
  if (value === null) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isTaskPriority(value: unknown): value is TaskPriority {
  return value === "Low" || value === "Medium" || value === "High";
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "Pending" || value === "In Progress" || value === "Done";
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.projectId === "string" &&
    typeof v.title === "string" &&
    typeof v.description === "string" &&
    isTaskPriority(v.priority) &&
    isTaskStatus(v.status) &&
    typeof v.createdAt === "number"
  );
}

function loadTasks(): Task[] {
  const parsed = safeParseJson(localStorage.getItem(STORAGE_KEY_TASKS));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isTask);
}

export const taskTitleChanged = createEvent<string>();
export const taskDescriptionChanged = createEvent<string>();
export const taskPriorityChanged = createEvent<TaskPriority>();

export const $taskTitleInput = createStore<string>("").on(
  taskTitleChanged,
  (_, title) => title,
);

export const $taskDescriptionInput = createStore<string>("").on(
  taskDescriptionChanged,
  (_, description) => description,
);

export const $taskPriorityInput = createStore<TaskPriority>("Medium").on(
  taskPriorityChanged,
  (_, priority) => priority,
);

export const addTask = createEvent<{
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
}>();
export const deleteTask = createEvent<{ taskId: string }>();
export const updateTaskStatus = createEvent<{
  taskId: string;
  status: TaskStatus;
}>();
export const updateTaskPriority = createEvent<{
  taskId: string;
  priority: TaskPriority;
}>();
export const setPriorityFilter = createEvent<{ priority: PriorityFilter }>();

export const $tasks = createStore<Task[]>(loadTasks())
  .on(addTask, (tasks, payload) => {
    const title = payload.title.trim();
    const description = payload.description.trim();
    if (title.length === 0) return tasks;
    const next: Task = {
      id: crypto.randomUUID(),
      projectId: payload.projectId,
      title,
      description,
      priority: payload.priority,
      status: "Pending",
      createdAt: Date.now(),
    };
    return [next, ...tasks];
  })
  .on(deleteTask, (tasks, { taskId }) => tasks.filter((t) => t.id !== taskId))
  .on(updateTaskStatus, (tasks, { taskId, status }) =>
    tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
  )
  .on(updateTaskPriority, (tasks, { taskId, priority }) =>
    tasks.map((t) => (t.id === taskId ? { ...t, priority } : t)),
  )
  .on(deleteProject, (tasks, { projectId }) =>
    tasks.filter((t) => t.projectId !== projectId),
  );

export const $priorityFilter = createStore<PriorityFilter>("All").on(
  setPriorityFilter,
  (_, { priority }) => priority,
);

export const $tasksByActiveProject = combine(
  { tasks: $tasks, activeProjectId: $activeProjectId },
  ({ tasks, activeProjectId }) => {
    if (activeProjectId === null) return [];
    return tasks.filter((t) => t.projectId === activeProjectId);
  },
);

export const $filteredTasks = combine(
  { tasks: $tasksByActiveProject, priority: $priorityFilter },
  ({ tasks, priority }) => {
    if (priority === "All") return tasks;
    return tasks.filter((t) => t.priority === priority);
  },
);

export const $taskCounters = $filteredTasks.map((tasks): TaskCounters => {
  let pending = 0;
  let inProgress = 0;
  let done = 0;

  for (const t of tasks) {
    if (t.status === "Pending") pending += 1;
    else if (t.status === "In Progress") inProgress += 1;
    else done += 1;
  }

  return {
    total: tasks.length,
    pending,
    inProgress,
    done,
  };
});

$tasks.watch((tasks) => {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
});
