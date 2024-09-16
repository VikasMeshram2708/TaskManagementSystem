"use client";

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

type Props = {
  tasks: Task[];
  isLoading: boolean;
};

export default function TaskColumn({ tasks, isLoading }: Props) {
  const statuses = [
    { label: "Todo", value: "todo" },
    { label: "In Progress", value: "inProgress" },
    { label: "Done", value: "done" },
  ];
  return (
    <div className="grid grid-cols-3 space-x-4">
      {statuses?.map((status) => (
        <Card
          key={status?.value}
          className="bg-gray-100 shadow shadow-gray-500 h-80 px-4 py-2"
        >
          <div className="bg-blue-500 text-white font-bold rounded text-center px-4 py-2">
            <h2>{status?.label}</h2>
          </div>
          <div className="py-5">
            {tasks
              ?.filter(
                (task) =>
                  task?.status.toLowerCase() === status?.value.toLowerCase()
              )
              .map((task, i) =>
                isLoading ? (
                  <p className="text-3xl font-bold text-black text-center">Loading</p>
                ) : (
                  <Card
                    key={i}
                    className="bg-blue-500/50 shadow-md rounded-lg overflow-hidden"
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="flex text-black items-center space-x-2 text-base">
                        <Label htmlFor="title" className="font-semibold">
                          Title:
                        </Label>
                        <span className="capitalize">{task?.title}</span>
                      </CardTitle>
                      <CardDescription className="flex text-black items-center space-x-2 text-base">
                        <Label className="font-semibold">Description:</Label>
                        <span className="capitalize">{task?.description}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex items-center space-x-2">
                      <Label className="font-semibold">Create At:</Label>
                      <p className="text-black text-sm">
                        {new Date().toDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-end gap-2 p-4">
                      <Button
                        variant="destructive"
                        size={"sm"}
                        className="font-bold"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size={"sm"}
                        className="bg-blue-500 border-none font-bold text-white hover:bg-blue-600"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size={"sm"}
                        className="bg-blue-700 text-white font-bold hover:bg-blue-600"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                )
              )}
          </div>
        </Card>
      ))}
    </div>
  );
}
