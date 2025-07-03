import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPlus } from "react-icons/fi";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import DeleteModal from "./DeleteModal";
import { PRIORITY_LEVELS } from "./TaskCard";
import { toast } from "react-toastify";

const initialTasks = [
  {
    id: 1,
    title: "Complete React assignment",
    description: "Build a task tracker application",
    priority: "medium",
    completed: false,
    dueDate: "2024-01-20",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Review JavaScript concepts",
    description: "Go through ES6+ features",
    priority: "low",
    completed: true,
    dueDate: "2024-01-18",
    createdAt: "2024-01-14T15:30:00Z",
  },
  {
    id: 3,
    title: "Testing completed tasks",
    description: "Ensure completed tasks show correctly in the UI",
    priority: "high",
    completed: true,
    dueDate: "2025-07-07",
    createdAt: "2025-07-01T12:00:00Z",
  },
  {
    id: 4,
    title: "Testing pending tasks",
    description: "Ensure pending tasks are displayed separately",
    priority: "high",
    completed: false,
    dueDate: "2025-07-07",
    createdAt: "2025-06-16T09:00:00Z",
  },
];

const TaskDashboard = () => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : initialTasks;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const sortTasks = (tasksToSort) => {
    return tasksToSort.sort((a, b) => {
      const priorityDiff =
        PRIORITY_LEVELS[b.priority].value - PRIORITY_LEVELS[a.priority].value;
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTasks = sortTasks(
    filteredTasks.filter((task) => !task.completed)
  );
  const completedTasks = sortTasks(
    filteredTasks.filter((task) => task.completed)
  );

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (selectedTask) {
      setTasks(
        tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...taskData } : task
        )
      );
      toast.success("Task updated successfully!");
    } else {
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully!");
    }
  };

  const handleDeleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
      toast.success("Task deleted successfully!");
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleToggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find((t) => t.id === taskId);
    toast.success(
      `Task marked as ${task.completed ? "pending" : "completed"}!`
    );
  };

  return (
    <div className="flex w-full h-full items-center justify-center bg-grey">
      <div className="flex flex-col h-full w-full max-w-7xl p-4 sm:p-6">
        <div className="top-0 pt-4 pb-6 z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-2xl sm:text-2.5xl font-semibold text-center sm:text-left hidden sm:block">
              Task Dashboard
            </h1>
            <button
              onClick={handleCreateTask}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-slate-950 transition-all ease-in-out duration-200 cursor-pointer w-full sm:w-auto"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create New Task</span>
            </button>
          </div>

          <div className="flex items-center rounded-full w-full max-w-lg mx-auto shadow-sm bg-white px-4 hover:shadow-md transition-shadow focus-within:shadow-lg">
            <FiSearch className="text-xl sm:text-2xl text-gray-400 transition-opacity focus-within:opacity-70" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 sm:py-3 px-2 outline-none text-base sm:text-xl text-gray-700 placeholder-gray-500 rounded-r-full focus:opacity-80"
            />
          </div>
        </div>

        <div className="flex-grow grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Pending Tasks */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Pending Tasks
              </h2>
              <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {pendingTasks.length}
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {pendingTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm"
                  >
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">
                      No pending tasks
                    </p>
                    <button
                      onClick={handleCreateTask}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer text-sm sm:text-base"
                    >
                      Create A Task
                    </button>
                  </motion.div>
                ) : (
                  pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Completed Tasks
              </h2>
              <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {completedTasks.length}
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {completedTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm"
                  >
                    <p className="text-gray-500 text-sm sm:text-base">
                      No completed tasks
                    </p>
                  </motion.div>
                ) : (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Task Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <TaskModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              task={selectedTask}
              onSave={handleSaveTask}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          task={taskToDelete}
        />
      </div>
    </div>
  );
};

export default TaskDashboard;
