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
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
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
      status: "inProgress",
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

  const [activeId, setActiveId] = useState(null);

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  function handleDragMove(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
    const overTaskIndex = tasks.findIndex((task) => task.id === over.id);

    if (activeTaskIndex !== overTaskIndex) {
      setTasks((tasks) => arrayMove(tasks, activeTaskIndex, overTaskIndex));
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
  
    if (!over) return;
  
    const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
    const overTaskIndex = tasks.findIndex((task) => task.id === over.id);
  
    if (activeTaskIndex === -1 || overTaskIndex === -1) return;
  
    const activeTask = tasks[activeTaskIndex];
    const overTask = tasks[overTaskIndex];
  
    // Check if the task was dropped in the same column or a different one
    if (activeTask.status !== overTask.status) {
      // Update task's status if moved to a different column
      const updatedTasks = tasks.map((task) =>
        task.id === active.id
          ? { ...task, status: overTask.status } // Update the status
          : task
      );
      setTasks(updatedTasks);
    } else if (activeTaskIndex !== overTaskIndex) {
      // Reorder tasks in the same column
      const updatedTasks = arrayMove(
        tasks.filter((task) => task.status === activeTask.status),
        activeTaskIndex,
        overTaskIndex
      );
      const otherTasks = tasks.filter((task) => task.status !== activeTask.status);
  
      setTasks([...updatedTasks, ...otherTasks]);
    }
  }
  

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "todo"),
    inProgress: tasks.filter((task) => task.status === "inProgress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <div className="min-h-screen container mx-auto py-6">
      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Todo Column */}
          <div className="bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-white bg-blue-600 p-4 rounded-t-lg">
              To Do
            </h2>
            <div className="p-4 space-y-4 min-h-[100px]">
              <SortableContext
                items={groupedTasks.todo.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {groupedTasks.todo.length > 0 ? (
                  groupedTasks.todo.map((task) => (
                    <TaskColumn
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      createdAt={task.createdAt}
                    />
                  ))
                ) : (
                  <div className="p-4 text-gray-500 border-2 border-dashed rounded-lg">
                    No tasks in this column
                  </div>
                )}
              </SortableContext>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-white bg-blue-600 p-4 rounded-t-lg">
              In Progress
            </h2>
            <div className="p-4 space-y-4 min-h-[100px]">
              <SortableContext
                items={groupedTasks.inProgress.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {groupedTasks.inProgress.length > 0 ? (
                  groupedTasks.inProgress.map((task) => (
                    <TaskColumn
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      createdAt={task.createdAt}
                    />
                  ))
                ) : (
                  <div className="p-4 text-gray-500 border-2 border-dashed rounded-lg">
                    No tasks in this column
                  </div>
                )}
              </SortableContext>
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-white bg-blue-600 p-4 rounded-t-lg">
              Done
            </h2>
            <div className="p-4 space-y-4 min-h-[100px]">
              <SortableContext
                items={groupedTasks.done.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {groupedTasks.done.length > 0 ? (
                  groupedTasks.done.map((task) => (
                    <TaskColumn
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      createdAt={task.createdAt}
                    />
                  ))
                ) : (
                  <div className="p-4 text-gray-500 border-2 border-dashed rounded-lg">
                    No tasks in this column
                  </div>
                )}
              </SortableContext>
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
