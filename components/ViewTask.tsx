"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export default function ViewTask({
  editable,
  task,
  setTView,
}: {
  editable: boolean;
  task: Task | null;
  setTView: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();

  const [updateQuery, setUpdateQuery] = useState({
    title: task?.title,
    description: task?.description,
  });

  const mutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const res = await fetch("/api/task/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: task?.id,
          title: data.title,
          description: data.description,
        }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || "Failed to Update Task");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      toast.success("Task Details Updated Successfully");
      setTView(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to Update Task: ${error.message}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      title: String(updateQuery.title),
      description: String(updateQuery.description),
    });
  };

  if (editable) {
    return (
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <div className="bg-white rounded-lg w-full max-w-lg mx-auto p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {mutation.isPending ? "Processing..." : "Edit Task"}
          </h2>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              value={updateQuery?.title}
              onChange={(e) =>
                setUpdateQuery({
                  ...updateQuery,
                  title: e.target.value,
                })
              }
              className="px-4 py-2 mt-1 rounded w-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="text"
              placeholder="Enter task title"
              aria-label="Task Title"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Description
            </label>
            <input
              value={updateQuery?.description}
              onChange={(e) =>
                setUpdateQuery({
                  ...updateQuery,
                  description: e.target.value,
                })
              }
              id="description"
              className="px-4 py-2 mt-1 rounded w-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="text"
              placeholder="Enter task description"
              aria-label="Task Description"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded font-bold transition duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setTView(false)}
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded font-bold transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-black text-3xl font-bold py-3">View Task</h2>
        <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">
          Title: {task?.title}
        </h3>
        <p className="text-gray-700 mb-4 capitalize">
          Description: {task?.description}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Created At: {new Date(task?.createdAt || Date.now()).toLocaleString()}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setTView(false)}
            type="button"
            className="px-4 py-2 rounded bg-gray-600 text-sm font-bold text-white hover:bg-gray-700 transition duration-200"
            aria-label="Close Task View"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
