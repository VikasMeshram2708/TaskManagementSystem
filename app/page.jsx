"use client";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import CreateTask from "@/components/CreateTask";
import ListTask from "@/components/ListTask";
import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      description: "Complete Task 1",
      status: "todo",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Task 2",
      description: "Complete Task 2",
      status: "todo",
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Task 3",
      description: "Complete Task 3",
      status: "todo",
      createdAt: new Date(),
    },
  ]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen container mx-auto">
        <div className="my-5">
          <CreateTask tasks={tasks} setTasks={setTasks} />
        </div>
        <div className="my-10">
          <ListTask tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </DndProvider>
  );
}
