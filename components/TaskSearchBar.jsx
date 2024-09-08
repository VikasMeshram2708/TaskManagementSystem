"use client";

import useDebounce from "@/helpers/useDebounce";
import { useEffect, useState } from "react";

export default function TaskSearchBar({ tasks }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery, 500);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (!debouncedValue.trim()) return;
    const filterOut = () => {
      const filtered = tasks.filter((item) =>
        item.title.toLowerCase().includes(debouncedValue.toLowerCase())
      );
      setFilteredTasks(filtered);
      console.log("fi", filtered);
    };
    filterOut();
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
          <select className="px-4 py-2 rounded">
            <option value="recent">Recent</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </section>
      <section className="mt-4">
        {searchQuery ? (
          filteredTasks && filteredTasks.length > 0 ? (
            <ul className="list-disc pl-5">
              {filteredTasks.map((task) => (
                <li key={task.id} className="py-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No tasks found. Try adjusting your search criteria.
            </p>
          )
        ) : (
          ""
        )}
      </section>
    </>
  );
}
