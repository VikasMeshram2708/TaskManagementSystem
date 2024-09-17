import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTaskSchema } from "@/app/models/TaskSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

type Props = {
  task: Task | null;
  isEditable: boolean;
  setSelectedTask: Dispatch<SetStateAction<Task | null>>;
};

export default function TaskModal({
  task,
  setSelectedTask,
  isEditable,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskSchema>({
    resolver: zodResolver(UpdateTaskSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: UpdateTaskSchema) => {
      console.log("ud", data);
      await Promise.resolve();
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Task Updated",
      });
      setTimeout(() => {
        setSelectedTask(null);
      }, 1000);
      return reset();
    },
    onError: () => {
      return toast({
        variant: "destructive",
        title: "Failed to Update Task",
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateTaskSchema> = (
    data: UpdateTaskSchema
  ) => {
    console.log("udd", data);
    mutate(data);
  };
  if (isEditable) {
    return (
      <Card className="fixed inset-0 backdrop-blur bg-black/50 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action=""
          className="max-w-lg bg-white mx-auto px-4 py-2 mt-20 rounded"
        >
          <CardHeader>
            <CardTitle>
              <span className="text-3xl font-bold text-black">Edit Task</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="title" className="font-bold">
                Title
              </Label>
              <Input
                defaultValue={task?.title}
                {...register("title", { required: true })}
                placeholder="Title"
              />
              {errors?.title && (
                <p className="text-sm text-red-500">{errors?.title?.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description" className="font-bold">
                Description
              </Label>
              <Input
                defaultValue={task?.description}
                {...register("description", { required: true })}
                placeholder="Description"
              />
              {errors?.description && (
                <p className="text-sm text-red-500">
                  {errors?.description?.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-10">
            <Button
              className="bg-gray-500 hover:bg-gray-400 text-white font-bold"
              type="submit"
              variant={"secondary"}
            >
              Save
            </Button>
            <Button
              onClick={() => setSelectedTask(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white hover:text-white font-bold"
              type="button"
              variant={"outline"}
            >
              Close
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }
  return (
    <div className="bg-black/50 backdrop-blur fixed inset-0 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 relative h-[500px]">
        <h2 className="text-3xl font-bold mb-4">Task Details</h2>
        <div className="mb-4">
          <span className="flex items-center space-x-2">
            <h2 className="text-lg font-bold">Title:</h2>
            <p>{task?.title}</p>
          </span>
        </div>
        <div className="mb-4">
          <span className="flex items-center space-x-2">
            <h2 className="text-lg font-bold">Description:</h2>
            <p className="text-lg">{task?.description}</p>
          </span>
        </div>
        {/* Close button at the bottom right */}
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={() => setSelectedTask(null)}
            variant="secondary"
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
