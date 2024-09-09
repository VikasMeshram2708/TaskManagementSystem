"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskColumn({
  id,
  title,
  description,
  status,
  createdAt,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {title}
        </h2>
        <span
          className={`text-xs sm:text-sm font-semibold py-1 px-3 rounded-full ${
            status === "todo"
              ? "bg-yellow-200 text-yellow-800"
              : status === "inProgress"
              ? "bg-blue-200 text-blue-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm sm:text-base mb-6">{description}</p>

      {/* Footer */}
      <div className="text-right text-xs text-gray-500 mt-4">
        Created on: {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
