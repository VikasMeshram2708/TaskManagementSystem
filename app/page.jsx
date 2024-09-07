import CreateTask from "@/components/CreateTask";
import TaskSearchBar from "@/components/TaskSearchBar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto my-10">
        <CreateTask />
      </div>
      <div className="my-5">
        <TaskSearchBar />
      </div>
    </div>
  );
}
