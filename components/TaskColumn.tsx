"use client";

import { DragEvent, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskModal from "./TaskModal";

type Props = {
  tasks: Task[];
  isLoading: boolean;
};

export default function TaskColumn({ tasks, isLoading }: Props) {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditable, setIsEditable] = useState(false);

  const statuses = [
    { label: "Todo", value: "todo" },
    { label: "In Progress", value: "inProgress" },
    { label: "Done", value: "done" },
  ];

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  function handleDragStart(taskItem: Task) {
    setDraggedTask(taskItem);
  }

  const { mutate } = useMutation({
    mutationFn: async ({
      e,
      newStatus,
    }: {
      e: DragEvent<HTMLDivElement>;
      newStatus: string;
    }) => {
      e.preventDefault();
      if (!draggedTask) return;

      const updatedTask = { ...draggedTask, status: newStatus };
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTask.id ? updatedTask : task
      );

      // Update localStorage
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );

      // Clear the dragged task
      setDraggedTask(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  function handleDrop(e: DragEvent<HTMLDivElement>, newStatus: string) {
    mutate({ e, newStatus });
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {statuses.map((status) => (
      <Card
        key={status.value}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status.value)}
        className="bg-gray-100 shadow-md min-h-[300px] max-h-[calc(100vh-2rem)] p-4 overflow-y-auto"
      >
        <div className="bg-blue-500 text-white font-bold rounded text-center p-2">
          <h2>{status.label}</h2>
        </div>
        <div className="py-5 space-y-4">
          {isLoading ? (
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-black text-center">
              Loading...
            </p>
          ) : (
            tasks
              .filter(
                (task) =>
                  task.status.toLowerCase() === status.value.toLowerCase()
              )
              .map((task) => (
                <Card
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  key={task.id}
                  className="bg-blue-500/50 shadow-md rounded-lg"
                >
                  <CardHeader className="p-2 sm:p-3 lg:p-4">
                    <CardTitle className="flex flex-col sm:flex-row text-black items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm sm:text-base">
                      <Label htmlFor="title" className="font-semibold">
                        Title:
                      </Label>
                      <span className="capitalize">{task.title}</span>
                    </CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row text-black items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm sm:text-base">
                      <Label className="font-semibold">Description:</Label>
                      <span className="capitalize">{task.description}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 lg:p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <Label className="font-semibold">Created At:</Label>
                    <p className="text-black text-xs sm:text-sm">
                      {new Date(task.createdAt).toDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-wrap items-center justify-end gap-2 p-2 sm:p-3 lg:p-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="font-bold text-xs sm:text-sm"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditable(true);
                        setSelectedTask(task);
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-blue-500 border-none font-bold text-white hover:bg-blue-600 text-xs sm:text-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditable(false);
                        setSelectedTask(task);
                      }}
                      variant="secondary"
                      size="sm"
                      className="bg-blue-700 text-white font-bold hover:bg-blue-600 text-xs sm:text-sm"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                  {selectedTask && (
                    <TaskModal
                      isEditable={isEditable}
                      task={selectedTask}
                      setSelectedTask={setSelectedTask}
                    />
                  )}
                </Card>
              ))
          )}
        </div>
      </Card>
    ))}
  </div>
  );
}
