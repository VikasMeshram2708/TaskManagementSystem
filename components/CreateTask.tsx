"use client";

import { CreateTaskSchema } from "@/app/models/TaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CreateTask() {
  const [tModal, setTModal] = useState(false);

  return (
    <div>
      <button
        onClick={() => setTModal((prev) => !prev)}
        type="button"
        className="bg-gray-200 hover:bg-gray-300 text-sm text-black px-4 py-2 rounded font-bold"
      >
        Add
      </button>
      {tModal && <TaskFormModal setTModal={setTModal} />}
    </div>
  );
}

function TaskFormModal({
  setTModal,
}: {
  setTModal: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(CreateTaskSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: CreateTaskSchema) => {
      const res = await fetch("/api/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result?.message || "Failed to Add New Task");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Task Created");
      reset();
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      setTModal(false);
    },
    onError: () => {
      toast.error("Task Creation Failed");
    },
  });

  const onSubmit: SubmitHandler<CreateTaskSchema> = (data) => {
    mutate(data);
  };

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-200 rounded-lg w-full max-w-lg mx-auto p-6 space-y-6 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-black text-center">
          Create Task
        </h2>

        <div>
          <input
            {...register("title", { required: true })}
            className="px-4 py-2 rounded w-full text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="text"
            placeholder="Title"
            aria-label="Task Title"
          />
          {errors?.title?.message && (
            <p className="text-sm text-red-500 font-bold">
              {errors?.title?.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("description", { required: true })}
            className="px-4 py-2 rounded w-full text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="text"
            placeholder="Description"
            aria-label="Task Description"
          />
          {errors?.description?.message && (
            <p className="text-sm text-red-500 font-bold">
              {errors?.description?.message}
            </p>
          )}
        </div>

        <div>
          <select
            {...register("status", { required: true })}
            className="w-full px-4 py-2 rounded text-black bg-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Task Status"
          >
            <option value="">Select Status</option>
            <option value="todo">Todo</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors?.status?.message && (
            <p className="text-sm text-red-500 font-bold">
              {errors?.status?.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded font-bold transition duration-200"
          >
            Submit
          </button>
          <button
            onClick={() => setTModal(false)}
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded font-bold transition duration-200"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
