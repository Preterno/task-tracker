import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiCalendar, FiFlag } from "react-icons/fi";

const PRIORITY_LEVELS = {
  high: {
    label: "High",
    color: "bg-red-100 text-red-800 border-red-200",
    value: 3,
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    value: 2,
  },
  low: {
    label: "Low",
    color: "bg-green-100 text-green-800 border-green-200",
    value: 1,
  },
};

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const priorityConfig = PRIORITY_LEVELS[task.priority];
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  const handleCardClick = (e) => {
    if (e.target.type === "checkbox" || e.target.closest("button")) {
      return;
    }
    onEdit(task);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-200 cursor-pointer ${
        task.completed ? "opacity-75" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 sm:w-5 sm:h-5 text-black rounded focus:ring-2 focus:ring-black cursor-pointer"
          />
          <h3
            className={`text-base sm:text-xl font-semibold ${
              task.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityConfig.color}`}
          >
            {priorityConfig.label}
          </span>
          <FiFlag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
        </div>
      </div>

      <p
        className={`text-sm sm:text-base mb-4 line-clamp-2 ${
          task.completed ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {task.description || "No description provided"}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-1">
            <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
          <span className="hidden sm:inline">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 sm:p-2 text-indigo-600 hover:text-indigo-900 transition-colors"
          >
            <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 transition-colors"
          >
            <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default TaskCard;
export { PRIORITY_LEVELS };
