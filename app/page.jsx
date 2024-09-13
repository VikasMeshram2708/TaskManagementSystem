"use client";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import CreateTask from "@/components/CreateTask";
import ListTask from "@/components/ListTask";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  const { isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("/api/task/all", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const result = await res.json();
      console.log("r", result);
      setTasks(result?.tasks || []);
      return result.tasks || [];
    },
  });

  if (isLoading) {
    return (
      <p className="text-3xl font-bold text-center text-cyan-500">Loading...</p>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen container mx-auto">
        <div className="my-5">
          <CreateTask tasks={tasks} setTasks={setTasks} />
        </div>
        <div className="my-5">
          <SearchBar tasks={tasks} />
        </div>
        <div className="my-10">
          <ListTask tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </DndProvider>
  );
}
