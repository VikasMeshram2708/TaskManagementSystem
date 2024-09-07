"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskColumn({ heading, tasks, status }) {
  // Render task items
  const renderTask = (tasks) => {
    if (!Array.isArray(tasks)) return <p>No tasks available</p>;

    const filteredTasks = tasks.filter(
      (task) => task.status.toLowerCase() === status.toLowerCase()
    );

    if (filteredTasks.length === 0) {
      return <p>No tasks for {status}</p>;
    }

    return filteredTasks.map((item) => {
      // Create a separate sortable component
      return <SortableTask key={item.id} task={item} />;
    });
  };

  return (
    <section className="shadow shadow-gray-500 px-4 py-2 rounded">
      <h2 className="text-2xl font-bold bg-blue-500 text-white px-4 py-3 rounded text-center mb-4">
        {heading}
      </h2>
      {renderTask(tasks)}
    </section>
  );
}

// Separate component for sortable task
function SortableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: transform ? 1000 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="grid gap-3 p-4 border rounded-lg bg-blue-500/30 mb-4"
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-gray-600">
        {new Date(task.createdAt).toLocaleDateString()}
      </p>

      <div className="flex items-center justify-end gap-4">
        <button
          className="text-white text-sm font-semibold rounded px-4 py-2 bg-red-500 hover:bg-red-600"
          type="button"
        >
          Delete
        </button>
        <button
          className="text-white text-sm font-semibold rounded px-4 py-2 bg-blue-500 hover:bg-blue-600"
          type="button"
        >
          View
        </button>
        <button
          className="text-white text-sm font-semibold rounded px-4 py-2 bg-blue-700 hover:bg-blue-800"
          type="button"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
