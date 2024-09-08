"use client";
import { useState } from "react";
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
      id: 22,
      title: "Task x",
      description: "Complete Task x",
      status: "in-progress",
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
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setTasks((tasks) => {
      const activeTask = tasks.find((task) => task.id === activeId);
      const overTask = tasks.find((task) => task.id === overId);

      if (!activeTask || !overTask) return tasks;

      // If the task is dropped in a different column
      if (activeTask.status !== overTask.status) {
        activeTask.status = overTask.status;
      }

      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overIndex = tasks.findIndex((task) => task.id === overId);

      return arrayMove(tasks, activeIndex, overIndex);
    });
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
        <TaskSearchBar tasks={tasks} />
      </div>
      {/* Task Columns */}
      <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <DndContext
          id="tasks"
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn
              heading="Todo"
              tasks={getTasksByStatus("todo")}
              status="todo"
            />
            <TaskColumn
              heading="In Progress"
              tasks={getTasksByStatus("in-progress")}
              status="in-progress"
            />
            <TaskColumn
              heading="Done"
              tasks={getTasksByStatus("done")}
              status="done"
            />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
