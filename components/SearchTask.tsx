import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import useDebounce from "@/lib/useDebounce";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  tasks: Task[];
};

export default function SearchTask({ tasks }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectQuery, setSelectQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const debouncedValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (!debouncedValue.trim() && !selectQuery) {
      setFilteredTasks([]);
    } else {
      const filtered = tasks.filter((task) => {
        const matchesSearchQuery = task.title
          .toLowerCase()
          .includes(debouncedValue.toLowerCase());
        const matchesStatus = selectQuery
          ? task.status.toLowerCase() === selectQuery.toLowerCase()
          : true;

        return matchesSearchQuery && matchesStatus;
      });

      setFilteredTasks(filtered);
    }
  }, [debouncedValue, selectQuery, tasks]);

  // Function to clear search and select inputs
  const clearResults = () => {
    setSearchQuery("");
    setSelectQuery("");
    setFilteredTasks([]);
  };

  return (
    <div className="container mx-auto px-4 py-2 space-y-6 border shadow shadow-gray-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-black">
          <Label htmlFor="search-input" className="text-sm font-medium">
            Search:
          </Label>
          <Input
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-64 md:w-36 lg:w-96 shadow shadow-gray-400"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-black">
          <Label htmlFor="status-select" className="text-sm font-medium">
            Sort By:
          </Label>
          <Select
            value={selectQuery}
            onValueChange={(value) => setSelectQuery(value)}
          >
            <SelectTrigger id="status-select" className="shadow w-full sm:w-64">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filteredTasks.length > 0 && (
          <Button
            onClick={clearResults}
            variant="destructive"
            size="sm"
            className="sm:mt-0 mt-2 font-bold"
          >
            Clear Results
          </Button>
        )}
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid gap-4 mt-4">
          {filteredTasks.map((task) => (
            <Card className="p-4" key={task.title}>
              <CardHeader className="mb-2">
                <CardTitle className="capitalize text-lg font-semibold">
                  {task.title}
                </CardTitle>
                <CardDescription className="capitalize text-sm">
                  {task.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2 justify-end">
                <Button variant="destructive" className="font-bold" size="sm">
                  Delete
                </Button>
                <Button
                  variant="outline"
                  className="font-bold bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  className="font-bold bg-blue-700 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : debouncedValue.trim() !== "" || selectQuery ? (
        <p className="text-center text-lg text-black font-medium mt-4">
          No Tasks Found
        </p>
      ) : null}
    </div>
  );
}
