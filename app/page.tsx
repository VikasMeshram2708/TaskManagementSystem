"use client";

import CreateTask from "@/components/CreateTask";
import SearchTask from "@/components/SearchTask";
import TaskColumn from "@/components/TaskColumn";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const { data , isLoading} = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const localTasks = localStorage.getItem("tasks");
        if (localTasks) {
          return setTasks(JSON.parse(localTasks));
        }
      } catch (error) {
        throw new Error("Failed to fetch the tasks");
      }
    },
  });

  const [tasks, setTasks] = useState<Task[]>(data);

  return (
    <div className="min-h-screen bg-gray-200">
      <main className="container mx-auto">
        {/* Add Task */}
        <div className="py-8">
          <CreateTask />
        </div>
        {/* Search Bar */}
        <div className="px-4 py-2">
          <SearchTask tasks={tasks} />
        </div>
        <div className="px-2 py-5">
          <TaskColumn isLoading={isLoading} tasks={tasks} />
        </div>
      </main>
    </div>
  );
}
