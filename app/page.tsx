"use client";

import CreateTask from "@/components/CreateTask";
import TaskColumn from "@/components/TaskColumn";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("/api/task/all");
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch tasks");
      }
      setTasks(result?.tasks || []);
      return result;
    },
  });
  return (
    <div className="min-h-screen">
      <main className="container mx-auto my-16">
        {/* Create Task Comp */}
        <CreateTask />
        {/* SearchBar Comp */}
        {/* Columns */}
        <div className="my-5">
          <TaskColumn isLoading={isLoading} tasks={tasks} setTasks={setTasks} />
        </div>
      </main>
    </div>
  );
}
