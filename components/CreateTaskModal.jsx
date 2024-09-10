"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function CreateTaskModal({ setToggleForm, tasks, setTasks }) {
  const { data: userData } = useSession();

  const queryClient = useQueryClient();

  const [details, setDetails] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  const createTask = async (details) => {
    try {
      const res = await fetch("/api/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uEmail: userData?.user?.email,
          title: details.title,
          description: details.description,
          status: details.status,
        }),
      });

      console.log("ud", {
        uEmail: userData?.user?.email,
        title: details.title,
        description: details.description,
        status: details.status,
      });

      const result = await res.json();

      if (!res.ok) {
        return toast.error(result?.message || "Failed to Create New Task");
      }
      setToggleForm(false); // Close the modal after successful creation
      toast.success(result?.message);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Failed to Create New Task");
    }
  };

  const { mutate } = useMutation({
    mutationFn: createTask,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(details); // Pass form data to mutate
    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
  };

  return (
    <section className="px-4 py-2 rounded border-2 bg-white mt-36 shadow shadow-gray-200 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold py-5">Create Task</h2>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div>
          <input
            value={details.title}
            onChange={(e) =>
              setDetails({
                ...details,
                title: e.target.value,
              })
            }
            placeholder="Enter Title"
            type="text"
            className="font-semibold px-4 py-2 rounded w-full shadow-lg shadow-gray-200 border"
          />
        </div>
        <div>
          <input
            value={details.description}
            onChange={(e) =>
              setDetails({
                ...details,
                description: e.target.value,
              })
            }
            placeholder="Enter Description"
            type="text"
            className="font-semibold px-4 py-2 rounded w-full shadow-lg shadow-gray-200 border"
          />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Select Status : </h2>
          <select
            value={details.status}
            onChange={(e) =>
              setDetails({
                ...details,
                status: e.target.value,
              })
            }
            className="px-4 py-2 rounded"
          >
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            Create
          </button>
          <button
            onClick={() => setToggleForm(false)}
            type="button"
            className="px-4 py-2 rounded bg-red-500 text-white"
          >
            Close
          </button>
        </div>
      </form>
    </section>
  );
}
