import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

// Task validation schema
const taskSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string(),
  priority: Yup.string()
    .oneOf(["high", "medium", "low"])
    .required("Priority is required"),
  dueDate: Yup.date().nullable(),
});

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "medium",
      dueDate: task?.dueDate || "",
    },
    validationSchema: taskSchema,
    onSubmit: (values) => {
      onSave(values);
      onClose();
    },
    enableReinitialize: true,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-75 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                {...formik.getFieldProps("title")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-base ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter task title"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...formik.getFieldProps("description")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-base resize-none"
                placeholder="Enter task description (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  {...formik.getFieldProps("priority")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-base ${
                    formik.touched.priority && formik.errors.priority
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  {...formik.getFieldProps("dueDate")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-base"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={formik.handleSubmit}
                className="px-6 py-3 text-base font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
              >
                {task ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskModal;
