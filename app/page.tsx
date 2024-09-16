"use client";

import CreateTask from "@/components/CreateTask";
import SearchTask from "@/components/SearchTask";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const localTasks = localStorage.getItem("tasks");
    if (localTasks) {
      return setTasks(JSON.parse(localTasks));
    }
  }, []);

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
      </main>
    </div>
  );
}
