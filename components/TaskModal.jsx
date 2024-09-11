"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TaskModal({
  task,
  toggleView,
  editable,
  setToggleView,
}) {
  const { id, title, description, createdAt } = task;

  const queryClient = useQueryClient();

  const [query, setQuery] = useState({
    newTitle: title,
    newDescription: description,
  });

  const handleUpdate = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/task/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId: id,
            title: query.newTitle,
            description: query.newDescription,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error?.message || "Failed to update task");
        }

        const result = await res.json();
        toast.success(result?.message || "Task updated successfully");
        return result;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      setToggleView(false);
    },
  });

  if (editable) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg h-[70vh] p-6 rounded-lg shadow-lg shadow-gray-500 mx-4 flex flex-col justify-between">
          <article className="flex flex-col space-y-6">
            {/* Modal Title */}
            <h2 className="text-2xl md:text-3xl font-semibold">Edit Task</h2>

            {/* Task Information */}
            <article className="space-y-4">
              <div>
                <h3 className="text-lg md:text-xl font-medium">Title: </h3>
                {/* <p className="text-gray-700 capitalize">{title}</p> */}
                <input
                  value={query.newTitle}
                  onChange={(e) =>
                    setQuery({
                      ...query,
                      newTitle: e.target.value,
                    })
                  }
                  className="px-4 py-2 border-b w-ful"
                  type="text"
                  placeholder="Title"
                />
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-normal">Description:</h3>
                {/* <p className="text-gray-700 capitalize">{description}</p> */}
                <input
                  value={query.newDescription}
                  onChange={(e) =>
                    setQuery({
                      ...query,
                      newDescription: e.target.value,
                    })
                  }
                  className="px-4 py-2 border-b w-ful"
                  type="text"
                  placeholder="Description"
                />
              </div>
            </article>
          </article>

          {/* Close Button */}
          <div className="flex justify-end mt-auto gap-3">
            <button
              onClick={() => handleUpdate.mutate()}
              className="bg-gray-500/50 hover:bg-gray-600 transition-colors px-4 py-2 rounded text-white text-sm md:text-base"
            >
              Save
            </button>
            <button
              onClick={() => setToggleView(false)}
              className="bg-gray-700 hover:bg-gray-800 transition-colors px-4 py-2 rounded text-white text-sm md:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-[70vh] p-6 rounded-lg shadow-lg shadow-gray-500 mx-4 flex flex-col justify-between">
        <article className="flex flex-col space-y-6">
          {/* Modal Title */}
          <h2 className="text-2xl md:text-3xl font-semibold">Task Details</h2>

          {/* Task Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg md:text-xl font-medium">Title: </h3>
              <p className="text-gray-700 capitalize">{title}</p>
            </div>

            <div className="flex items-center gap-3">
              <h3 className="text-lg md:text-xl font-normal">Description:</h3>
              <p className="text-gray-700 capitalize">{description}</p>
            </div>
          </div>

          {/* Creation Date */}
          <p className="text-sm font-normal">
            Created At: {new Date(createdAt).toLocaleDateString()}
          </p>
        </article>

        {/* Close Button */}
        <div className="flex justify-end mt-auto">
          <button
            onClick={() => setToggleView(false)}
            className="bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded text-white text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
