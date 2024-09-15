type TaskStatus = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}