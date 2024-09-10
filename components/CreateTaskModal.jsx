"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskSchema } from "@/app/models/Task";

export default function CreateTaskModal({ setToggleForm, tasks, setTasks }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TaskSchema),
  });

  const onSubmit = (data) => {
    console.log("data", data);
    setToggleForm(false);
    setTasks({
      ...tasks,
      data,
    });
    // setTasks((prev) => ({
    //   ...prev,
    //   data,
    // }));
  };
  return (
    <section className="px-4 py-2 rounded border-2 bg-white mt-36 shadow shadow-gray-200 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold py-5">Create Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div>
          <input
            {...register("title", { required: true })}
            placeholder="Enter Title"
            type="text"
            className="font-semibold px-4 py-2 rounded w-full shadow-lg shadow-gray-200 border"
          />
          {errors.title && (
            <p className="text-sm font-bold text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("description", { required: true })}
            placeholder="Enter Description"
            type="text"
            className="font-semibold px-4 py-2 rounded w-full shadow-lg shadow-gray-200 border"
          />
          {errors.description && (
            <p className="text-sm font-bold text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Select Status : </h2>
          <select
            {...register("status", { required: true })}
            className="px-4 py-2 rounded"
          >
            <option value="recent">Recent</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && (
            <p className="text-sm font-bold text-red-500">
              {errors.status.message}
            </p>
          )}
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
