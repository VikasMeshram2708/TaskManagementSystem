"use client";

import useDebounce from "helpers/useDebounce";
import { useEffect, useState } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";

export default function SearchBar({ tasks }) {
  const [query, setQuery] = useState({
    taskName: "",
    sortByValue: "",
  });
  const [filteredTasks, setFilteredTasks] = useState([]);

  const debouncedValue = useDebounce(query.taskName, 500);
  const debouncedSortValue = useDebounce(query.sortByValue, 500);

  useEffect(() => {
    function filterTasks() {
      if (!tasks) return;

      let result = tasks;

      // Apply search filtering
      if (debouncedValue.trim()) {
        result = result.filter((task) =>
          task.title.toLowerCase().includes(debouncedValue.toLowerCase())
        );
      }

      // Apply sort filtering
      if (debouncedSortValue.trim()) {
        if (debouncedSortValue === "recent") {
          // Show all tasks if 'Recent' is selected
          result = tasks;
        } else {
          // Filter tasks based on status if not 'Recent'
          result = result.filter((task) =>
            task.status.toLowerCase().includes(debouncedSortValue.toLowerCase())
          );
        }
      }

      setFilteredTasks(result);
    }
    filterTasks();
  }, [debouncedValue, debouncedSortValue, tasks]);

  // Clear search and sort queries
  const clearResults = () => {
    setQuery({ taskName: "", sortByValue: "" });
    setFilteredTasks(tasks); // Reset to show all tasks
  };

  return (
    <section className="container mx-auto p-5 rounded shadow shadow-gray-400 flex flex-col gap-5">
      <div className="flex items-center gap-3 justify-between">
        {/* Search Input */}
        <div className="flex items-center gap-3">
          <label htmlFor="search" className="text-gray-700">
            Search:
          </label>
          <input
            id="search"
            value={query.taskName}
            onChange={(e) =>
              setQuery({
                ...query,
                taskName: e.target.value,
              })
            }
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded shadow shadow-gray-500 w-96"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-3">
          <label htmlFor="sortBy" className="text-gray-700">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={query.sortByValue}
            onChange={(e) =>
              setQuery({
                ...query,
                sortByValue: e.target.value,
              })
            }
            className="px-4 py-2 rounded shadow shadow-gray-500"
          >
            <option value="">Select Sort Option</option>
            <option value="recent">Recent</option>
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Clear Results Button */}
        {(debouncedValue.trim() || debouncedSortValue.trim()) && (
        <button
        onClick={clearResults}
        className="px-4 py-2 bg-red-500 flex items-center gap-3 text-white rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
        aria-label="Clear Results"
        role="button"
      >
        <span className="inline-block">
          Clear Results
        </span>
        <span className="inline-block ml-2">
          <RiDeleteBack2Fill size={24} />
        </span>
      </button>
        )}
      </div>

      {/* Conditionally render the heading and task list */}
      {(debouncedValue.trim() || debouncedSortValue.trim()) && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-3">
            Search Result:
            <span className="bg-blue-700 font-bold text-white text-lg px-4 py-2 ml-3 rounded-full">
              {filteredTasks.length}
            </span>
          </h2>
          <ul className="space-y-4">
            {filteredTasks.length === 0 ? (
              <li className="text-gray-500">No results found</li>
            ) : (
              filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="bg-blue-500 p-4 rounded-lg grid gap-4 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <div>
                    <h3 className="font-medium text-white capitalize break-words">
                      {task.title}
                    </h3>
                    <p className="text-sm text-white capitalize break-words">
                      {task.description}
                    </p>
                    <p className="text-sm text-white mt-5">
                      Created At:{" "}
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
