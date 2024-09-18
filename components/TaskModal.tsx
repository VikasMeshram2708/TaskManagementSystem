import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
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
import { UpdateTaskSchema } from "@/app/models/TaskSchema";
// import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [uQuery, setUQuery] = useState({
    id: task?.id,
    title: task?.title,
    description: task?.description,
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const uResult = UpdateTaskSchema.safeParse(uQuery);
      if (!uResult.success) {
        const filteredErr = uResult?.error?.issues?.map((e) => ({
          field: e.path.join("."),
          message: e?.message,
        }));
        return toast({
          variant: "destructive",
          title: `Error : ${filteredErr?.map((e) => e.field)}`,
          description: filteredErr?.map((e) => e.message) || "Invalid Data",
        });
      }
      const data = uResult?.data;
      const res = await fetch("/api/task/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result?.message || "Failed to Update Task",
        });
        throw new Error(result?.message || "Failed to Update Task");
      }
      toast({
        title: "Success",
        description: result?.message || "Task Updated Successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      setSelectedTask(null);
      return result;
    } catch (error) {
      throw new Error(`Something went wrong. Failed to update Task ${error}}`);
    }
  };
  if (isEditable) {
    return (
      <Card className="fixed inset-0 backdrop-blur bg-black/50 w-full">
        <form
          onSubmit={onSubmit}
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
                type="text"
                value={uQuery?.title}
                onChange={(e) =>
                  setUQuery({
                    ...uQuery,
                    title: e.target.value,
                  })
                }
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="description" className="font-bold">
                Description
              </Label>
              <Input
                type="text"
                value={uQuery?.description}
                onChange={(e) =>
                  setUQuery({
                    ...uQuery,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
              />
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
