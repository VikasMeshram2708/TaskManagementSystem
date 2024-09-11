"use client";

import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import TaskModal from "./TaskModal";

export default function ListTask({ tasks, setTasks }) {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status.toLowerCase() === "todo");
    const fInProgress = tasks.filter(
      (task) => task.status.toLowerCase() === "inprogress"
    );
    const fDone = tasks.filter((task) => task.status.toLowerCase() === "done");

    setTodos(fTodos);
    setInProgress(fInProgress);
    setDone(fDone);
  }, [tasks]);

  const statuses = [
    { label: "todo", tasks: todos },
    { label: "inprogress", tasks: inProgress },
    { label: "done", tasks: done },
  ];

  // Handle task drop to update its status or position
  const handleDrop = async (draggedTask, newStatus, targetTask) => {
    try {
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          if (task.id === draggedTask.id) {
            // Update the task's status if moved between columns
            const res = await fetch("/api/task/update", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                taskId: task.id,
                status: newStatus,
              }),
            });

            if (!res.ok) {
              throw new Error("Failed to update task on server");
            }

            // Only update local state if the API call was successful
            return { ...task, status: newStatus };
          }
          return task;
        })
      );

      if (targetTask) {
        const filteredTasks = updatedTasks.filter(
          (task) => task.status === newStatus
        );
        const targetIndex = filteredTasks.findIndex(
          (t) => t.id === targetTask.id
        );
        const draggedIndex = filteredTasks.findIndex(
          (t) => t.id === draggedTask.id
        );

        // Reorder tasks within the same column
        const [removed] = filteredTasks.splice(draggedIndex, 1);
        filteredTasks.splice(targetIndex, 0, removed);

        setTasks(
          updatedTasks.map(
            (task) => filteredTasks.find((t) => t.id === task.id) || task
          )
        );
      } else {
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Here you might want to show an error message to the user
      // and possibly revert the drag operation
    }
  };

  const TaskCard = ({ task, status }) => {
    const [toggleView, setToggleView] = useState(false);
    const [editable, setEditable] = useState(false);

    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: "task",
      item: { id: task.id, status: task.status },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    const [{ isOver, canDrop }, dropRef] = useDrop({
      accept: "task",
      drop: (draggedItem) => {
        if (draggedItem.id !== task.id) {
          handleDrop(draggedItem, status.label, task);
        }
      },
      canDrop: (draggedItem) => draggedItem.status === task.status,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    return (
      <div
        ref={(node) => dragRef(dropRef(node))}
        className={`bg-blue-500/50 p-4 rounded-lg grid gap-4 shadow hover:shadow-lg transition-shadow duration-200 ${
          isDragging ? "opacity-50" : "opacity-100"
        } ${isOver && canDrop ? "bg-gray-200" : ""}`}
      >
        <div>
          <h3 className="font-medium text-black capitalize">{task.title}</h3>
          <p className="text-sm text-black capitalize">{task.description}</p>
          <p className="text-sm text-black mt-5">
            Created At : {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4 justify-end mt-5">
          <button
            className="text-sm px-2 py-1 rounded text-white font-bold bg-red-500 hover:bg-red-600 transition-colors duration-300"
            type="button"
          >
            Delete
          </button>
          <button
            onClick={() => setToggleView((prev) => !prev)}
            className="text-sm px-2 py-1 rounded text-white font-bold bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
            type="button"
          >
            View
          </button>
          <button
            onClick={() => {
              setEditable(true);
              setToggleView((prev) => !prev);
            }}
            className="text-sm px-2 py-1 rounded text-white font-bold bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            type="button"
          >
            Edit
          </button>
        </div>
        {toggleView && (
          <TaskModal
            task={task}
            editable={editable}
            toggleView={toggleView}
            setToggleView={setToggleView}
          />
        )}
      </div>
    );
  };

  const Column = ({ status }) => {
    const [{ isOver }, dropRef] = useDrop(() => ({
      accept: "task",
      drop: (draggedItem) => handleDrop(draggedItem, status.label),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return (
      <div
        ref={dropRef}
        className={`bg-gray-100 border border-gray-300 rounded-lg shadow-md h-auto p-4 flex flex-col ${
          isOver ? "bg-gray-200" : ""
        }`}
      >
        <h2 className="capitalize bg-blue-500 text-lg font-semibold mb-4 border-b border-gray-300 px-4 py-2 rounded text-white">
          {status.label}
        </h2>
        <div className="space-y-4">
          {status.tasks.length === 0 ? (
            <p className="text-gray-500 text-center">No Tasks</p>
          ) : (
            status.tasks.map((task) => (
              <TaskCard key={task.id} task={task} status={status} />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statuses.map((status, i) => (
          <Column key={i} status={status} />
        ))}
      </section>
    </div>
  );
}
