"use client";

import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "./ui/input";
import { Dispatch, SetStateAction, useState } from "react";
import { CreateTaskSchema } from "@/app/models/TaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";

export default function CreateTask() {
  const [tForm, setTForm] = useState(false);

  return (
    <div className="p-4">
      <Button
        onClick={() => setTForm((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md shadow-md transition"
      >
        Add Task
      </Button>
      {tForm && <TaskForm setTForm={setTForm} />}
    </div>
  );
}

function TaskForm({
  setTForm,
}: {
  setTForm: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(CreateTaskSchema),
  });

  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: async (data: CreateTaskSchema) => {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          const existingTasksJson = localStorage.getItem("tasks");

          const existingTasks = existingTasksJson
            ? JSON.parse(existingTasksJson)
            : [];

          const updatedTasks = [...existingTasks, data];
          localStorage.setItem("tasks", JSON.stringify(updatedTasks));
          resolve();
        }, 500)
      );
    },
    onSuccess: () => {
      reset();
      toast({
        title: "Success",
        description: "Task Created",
      });
      setTForm(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  function onSubmit(data: CreateTaskSchema) {
    mutate(data);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-4 md:mx-auto">
        <h2 className="font-semibold mb-4 text-black text-3xl">Create Task</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title", { required: true })}
              placeholder="Title"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-700 placeholder-gray-500"
            />
            {errors?.title && (
              <p className="text-sm text-red-500">{errors?.title?.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("description", { required: true })}
              placeholder="Description"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-700 placeholder-gray-500"
            />
            {errors?.description && (
              <p className="text-sm text-red-500">
                {errors?.description?.message}
              </p>
            )}
          </div>
          <div>
            <Controller
              name="status"
              control={control}
              // defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full border border-gray-300 rounded-md p-3 text-gray-700">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors?.status && (
              <p className="text-sm text-red-500">{errors?.status?.message}</p>
            )}
          </div>
          <div className="flex items-center justify-end space-x-3">
            <Button
              type="submit"
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-500"
            >
              Save
            </Button>
            <Button
              onClick={() => setTForm(false)}
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-500"
            >
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
