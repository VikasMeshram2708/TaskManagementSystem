"use client";

import CreateTask from "@/components/CreateTask";
import TaskColumn from "@/components/TaskColumn";
import TaskSearchBar from "@/components/TaskSearchBar";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      description: "Complete Task 1",
      status: "todo",
      createdAt: Date.now(),
    },
    {
      id: 2,
      title: "Task 2",
      description: "Complete Task 2",
      status: "todo",
      createdAt: Date.now(),
    },
    {
      id: 3,
      title: "Task 3",
      description: "Complete Task 3",
      status: "done",
      createdAt: Date.now(),
    },
  ]);


  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find(task => task.id === active.id);
    const overTask = tasks.find(task => task.id === over.id);

    if (!activeTask || !overTask) return;

    // Update task status if dragged to a different column
    const updatedTasks = tasks.map(task => {
      if (task.id === activeTask.id) {
        return { ...task, status: overTask.status };
      } else if (task.id === overTask.id) {
        return { ...task, status: activeTask.status };
      }
      return task;
    });

    const activeTaskIndex = updatedTasks.findIndex(task => task.id === active.id);
    const overTaskIndex = updatedTasks.findIndex(task => task.id === over.id);

    setTasks(arrayMove(updatedTasks, activeTaskIndex, overTaskIndex));
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 7,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="min-h-screen container mx-auto">
      {/* Create Task Section */}
      <div className="my-10 p-6">
        <CreateTask />
      </div>

      {/* Task Search Bar */}
      <div className="my-5 p-4">
        <TaskSearchBar />
      </div>

      {/* Task Columns */}
      <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <SortableContext
            items={getTasksByStatus("todo").map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn heading="Todo" tasks={getTasksByStatus("todo")} status="todo" />
          </SortableContext>
          <SortableContext
            items={getTasksByStatus("in-progress").map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn heading="In Progress" tasks={getTasksByStatus("in-progress")} status="in-progress" />
          </SortableContext>
          <SortableContext
            items={getTasksByStatus("done").map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn heading="Done" tasks={getTasksByStatus("done")} status="done" />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
