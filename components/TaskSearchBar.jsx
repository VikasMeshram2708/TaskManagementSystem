"use client";

export default function TaskSearchBar() {
  return (
    <section className="flex items-center justify-between container mx-auto shadow shadow-gray-400 p-4 rounded">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold">Search: </h2>
        <input
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
  );
}
