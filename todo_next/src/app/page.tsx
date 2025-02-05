"use client";
import { useState, useRef, type KeyboardEvent } from "react";

type Task = {
  id: number;
  task: string;
  time?: string;
  description: string;
  file: object;
  completed: boolean;
  priority: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskTime, setTaskTime] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskFile, setTaskFile] = useState<File[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterPriority, setPriority] = useState<boolean | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleAddTask = () => {
    if (taskInput.trim() === "") return;
    const newTask: Task = {
      id: Date.now(),
      task: taskInput,
      time: taskTime || undefined,
      description: taskDescription,
      file: taskFile,
      completed: false,
      priority: false,
    };
    setTasks([...tasks, newTask]);
    resetInputFields();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskInput(task.task);
    setTaskTime(task.time || "");
    setTaskDescription(task.description || "");
    setTaskFile([]);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    const updatedTask: Task = {
      ...editingTask,
      task: taskInput,
      time: taskTime || undefined,
      description: taskDescription,
    };
    setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
    resetInputFields();
    setEditingTask(null);
  };

  const resetInputFields = () => {
    setTaskInput("");
    setTaskTime("");
    setTaskDescription("");
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const togglePriority = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority: !task.priority } : task
      )
    );
  };

  const handleFilterChange = (newFilter: "all" | "active" | "completed") => {
    setFilter(newFilter);
    setPriority(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterPriority !== null) return task.priority === filterPriority;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const handleTaskInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      descriptionRef.current?.focus();
    }
  };

  return (
    <body className="bg-zinc-950 text-white">
      <div className="text-sm sm:text-md">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="text-4xl xl:text-6xl relative z-20 md:text-5xl font-bold text-black dark:text-white font-sans tracking-tight text-center mt-20 md:mt-40 mb-10">
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-teal-400 via-cyan-500 to-cyan-600 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">TO-DO IN NEXT JS.</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-teal-400 via-cyan-500 to-cyan-700 py-4">
                <span className="">TO-DO IN NEXT JS.</span>
              </div>
            </div>
          </h1>
          <div className="flex flex-col overflow-hidden backdrop-blur-xl bg-zinc-950/50 border-cyan-600 border-2 rounded-xl mb-5 p-4">
            <div className="flex overflow-hidden">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={handleTaskInputKeyDown}
                maxLength={70}
                placeholder="Create a new Todo"
                className="w-full p-4 text-bolder mx-auto font-semibold focus:outline bg-zinc-700/10 focus:border-cyan-500 border-2 caret-cyan-500 border-zinc-800 rounded-xl "
              />
            </div>
            <div className="flex overflow-hidden">
              <textarea
                ref={descriptionRef}
                name="description"
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Description..."
                className="w-full p-4 mx-auto bg-zinc-700/10 focus:outline focus:border-cyan-500 caret-cyan-500 border-2 border-zinc-800 rounded-xl my-2"
              ></textarea>
            </div>
            <div className="flex overflow-hidden justify-between mt-2">
              <input
                type="datetime-local"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                className="flex overflow-hidden p-4 text-gray-400 max-w-[250px] bg-zinc-700/10 border-2 border-zinc-800 rounded-2xl focus:outline focus:border-cyan-500"
              />
              <button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                className="flex pl-4 p-2 sm:p-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl font-semibold hover:text-white text-zinc-900 duration-300 self-center"
              >
                {editingTask ? "Update" : "Send"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <ul className="list-none border-cyan-600 border-2 rounded-2xl drop-shadow-lg">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`flex flex-col overflow-hidden rounded-2xl hover:bg-zinc-950 p-4 ${
                  task.completed ? "line-through" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="mr-4 p-2 self-center accent-cyan-500 text-zinc-900"
                    />
                    <div>
                      <strong className="text-md">{task.task}</strong>
                      {task.description && (
                        <p className="text-sm text-gray-400 mt-1">
                          {task.description}
                        </p>
                      )}
                      {task.time && (
                        <p className="text-xs text-gray-500 mt-1">
                          ({task.time})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center self-center">
                    <button
                      onClick={() => togglePriority(task.id)}
                      className="p-2 rounded-3xl hover:text-yellow-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={task.priority ? "yellow" : "currentColor"}
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditTask(task)}
                      className="hover:text-cyan-500 text-white p-2 rounded-3xl cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="hover:text-red-600 text-white p-2 rounded-3xl cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap justify-around m-6 gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1bd4f5_0%,#009688_50%,#1bd4f5_100%)]" />
              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full ${
                  filter === "all"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-black"
                    : "bg-zinc-950 text-white"
                } px-3 py-1 text-sm font-medium backdrop-blur-3xl hover:bg-gradient-to-r from-teal-500 to-cyan-500 hover:text-black`}
              >
                All Tasks
              </span>
            </button>

            <button
              onClick={() => handleFilterChange("active")}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1bd4f5_0%,#009688_50%,#1bd4f5_100%)]" />
              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full ${
                  filter === "active"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-black"
                    : "bg-zinc-950 text-white"
                } px-3 py-1 text-sm font-medium backdrop-blur-3xl hover:bg-gradient-to-r from-teal-500 to-cyan-500 hover:text-black`}
              >
                Active
              </span>
            </button>

            <button
              onClick={() => handleFilterChange("completed")}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1bd4f5_0%,#009688_50%,#1bd4f5_100%)]" />
              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full ${
                  filter === "completed"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-black"
                    : "bg-zinc-950 text-white"
                } px-3 py-1 text-sm font-medium backdrop-blur-3xl hover:bg-gradient-to-r from-teal-500 to-cyan-500 hover:text-black`}
              >
                Completed
              </span>
            </button>

            <button
              onClick={() =>
                setPriority((prev) =>
                  prev === null ? true : prev ? false : null
                )
              }
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1bd4f5_0%,#009688_50%,#1bd4f5_100%)]" />
              <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full ${
                  filterPriority !== null
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-black"
                    : "bg-zinc-950 text-white"
                } px-3 py-1 text-sm font-medium backdrop-blur-3xl hover:bg-gradient-to-r from-teal-500 to-cyan-500 hover:text-black`}
              >
                Priority
              </span>
            </button>
            <button
              onClick={clearCompletedTasks}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1bd4f5_0%,#009688_50%,#1bd4f5_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-gradient-to-r from-teal-500 to-cyan-500 hover:text-black">
                Clear Completed
              </span>
            </button>
          </div>
        </div>
      </div>
    </body>
  );
}
