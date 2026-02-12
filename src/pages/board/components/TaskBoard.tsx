import TaskColumn from "./TaskColumn";

export default function TaskBoard() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TaskColumn status="Pending" />
      <TaskColumn status="In Progress" />
      <TaskColumn status="Done" />
    </div>
  );
}

