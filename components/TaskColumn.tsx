/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dispatch, DragEvent, SetStateAction, useState } from "react";
import ViewTask from "./ViewTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function TaskColumn({
  tasks,
  setTasks,
  isLoading,
}: {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();

  const [tView, setTView] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editable, setEditble] = useState(false);

  const statuses = [
    { label: "Todo", value: "todo" },
    { label: "In Progress", value: "inProgress" },
    { label: "Done", value: "done" },
  ];

  function handleDragStart(event: DragEvent<HTMLLIElement>, task: Task) {
    setDraggedTask(task);
  }

  async function handleDrop(
    event: DragEvent<HTMLDivElement>,
    status: TaskStatus
  ) {
    event.preventDefault();

    if (!draggedTask) return;

    // Update the task's status
    // const updatedTasks = tasks.map((task) =>
    //   task.id === draggedTask.id ? { ...task, status } : task
    // );

    try {
      const res = await fetch("/api/task/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: draggedTask.id,
          status: status,
        }),
      });
      const result = await res.json();
      console.log("update-res", result);

      if (!res.ok) {
        return toast.error(result?.message || "Failed to Update Task Status");
      }
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      return result;
    } catch (error) {
      console.log(`Something went wrong. Failed to update the task ${error}`);
    }
    setDraggedTask(null);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/task/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Failed to Delete Task");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      return toast.success("Task Deleted");
    },
    onError: () => {
      return toast.error("Task Deletion Failed");
    },
  });

  return (
    <div className="flex space-x-6 overflow-x-auto">
      {statuses.map((status) => (
        <div
          key={status.label}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status.value as TaskStatus)}
          className="flex-1 min-w-[240px] bg-gray-100 rounded-lg p-4 shadow-md"
        >
          <h2
            id={status.value}
            className={`text-xl font-semibold mb-4 text-center p-3 shadow-gray-400 shadow ${
              status.value === "inProgress" && "bg-green-500 text-white"
            }
            ${status.value === "done" && "bg-cyan-500 text-white"}
            ${status.value === "todo" && "bg-blue-500 text-white"}
            `}
          >
            {status.label}
          </h2>
          <ul className="space-y-4">
            {isLoading ? (
              <p className="text-3xl text-black text-center">Loading...</p>
            ) : (
              tasks
                .filter((task) => task.status === status.value)
                .map((task, i) => (
                  <li
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="bg-white shadow-gray-400 p-4 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-1 capitalize">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mb-2 capitalize">
                      {task.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created At: {task.createdAt.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-5">
                      <button
                        onClick={() => mutate(task?.id)}
                        type="button"
                        className="px-4 py-2 rounded bg-red-700 text-sm font-bold w-20 hover:bg-red-500 text-white transition duration-200"
                        aria-label="Delete"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setTView((prev) => !prev);
                        }}
                        type="button"
                        className="px-4 py-2 rounded bg-blue-500 text-sm font-bold w-20 hover:bg-blue-400 text-white transition duration-200"
                        aria-label="View"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setTView((prev) => !prev);
                          setEditble((prev) => !prev);
                        }}
                        type="button"
                        className="px-4 py-2 rounded bg-blue-700 text-sm font-bold w-20 hover:bg-blue-500 text-white transition duration-200"
                        aria-label="Edit"
                      >
                        Edit
                      </button>
                    </div>
                    {tView && (
                      <ViewTask
                        task={selectedTask}
                        editable={editable}
                        setTView={setTView}
                      />
                    )}
                  </li>
                ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
