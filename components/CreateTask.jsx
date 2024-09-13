"use client";

import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

export default function CreateTask({ tasks, setTasks }) {
  const [toggleForm, setToggleForm] = useState(false);
  return (
    <section className="container mx-auto px-4 py-2">
      <button
        onClick={() => setToggleForm((prev) => !prev)}
        type="button"
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
      >
        Add
      </button>
      {toggleForm && (
        <div
          data-testid="create-task-modal"
          className="fixed inset-0 bg-black/50 backdrop-blur-lg"
        >
          <CreateTaskModal
            tasks={tasks}
            setTasks={setTasks}
            setToggleForm={setToggleForm}
          />
        </div>
      )}
    </section>
  );
}
