"use client";

import useDebounce from "@/helpers/useDebounce";
import { useEffect, useState } from "react";

export default function TaskSearchBar({ tasks = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery, 500);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectValue, setSelectValue] = useState("");

  // Effect for handling filtering by status
  useEffect(() => {
    if (!selectValue) return;

    const filterByStatus = () => {
      const filtered = tasks.filter((item) =>
        item.status.toLowerCase().includes(selectValue.toLowerCase())
      );
      setFilteredTasks(filtered);
    };

    filterByStatus();
  }, [selectValue, tasks]);

  // Effect for handling search query filtering
  useEffect(() => {
    if (!debouncedValue.trim()) return;

    const filterByQuery = () => {
      const filtered = tasks.filter((item) =>
        item.title.toLowerCase().includes(debouncedValue.toLowerCase())
      );
      setFilteredTasks(filtered);
    };

    filterByQuery();
  }, [debouncedValue, tasks]);

  return (
    <>
      <section className="flex items-center justify-between container mx-auto shadow shadow-gray-400 p-4 rounded">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">Search: </h2>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search Task"
            className="px-4 py-2 w-full max-w-xl rounded shadow shadow-gray-200 border text-black"
          />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">Sort By :</h2>
          <select
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            className="px-4 py-2 rounded"
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </section>

      <section className="mt-4">
        {(debouncedValue || selectValue) && filteredTasks.length > 0 ? (
          <ul className="list-disc pl-5">
            {filteredTasks.map((task) => (
              <li key={task.id} className="py-2">
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </li>
            ))}
          </ul>
        ) : (debouncedValue || selectValue) && filteredTasks.length === 0 ? (
          <p className="text-gray-500">
            No tasks found. Try adjusting your search criteria.
          </p>
        ) : null}
      </section>
    </>
  );
}
