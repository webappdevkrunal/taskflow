export type TaskStatus = "Pending" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export type PriorityFilter = "All" | TaskPriority;

export interface Project {
  id: string;
  name: string;
  createdAt: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: number;
}

export interface TaskCounters {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
}


