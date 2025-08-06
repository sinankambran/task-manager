import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const columns = ["To Do", "In Progress", "Done"];

function TaskBoard({ tasks, setTasks }) {
  const grouped = columns.map((col) => ({
    title: col,
    items: tasks.filter((task) => task.status === col),
  }));

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const task = tasks.find((t) => t._id === draggableId);
    const updated = { ...task, status: destination.droppableId };
    await axios.put(`${import.meta.env.VITE_BACKEND}/tasks/${task._id}`, updated);
    toast.success("Task moved!");
    setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND}/tasks/${id}`);
    toast.success("Task deleted!");
    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

const editTask = async (task) => {
  const newTitle = prompt("Edit Title", task.title);
  const newDescription = prompt("Edit Description", task.description || "");
  const newPriority = prompt("Edit Priority (High, Medium, Low)", task.priority);
  const newStatus = prompt("Edit Status (To Do, In Progress, Done)", task.status);
  const newDueDate = prompt("Edit Due Date (YYYY-MM-DD)", task.dueDate);

  if (!newTitle || !newStatus || !newPriority) return;

  const updated = {
    ...task,
    title: newTitle,
    description: newDescription,
    priority: newPriority,
    status: newStatus,
    dueDate: newDueDate,
  };

  try {
    await axios.put(`${import.meta.env.VITE_BACKEND}/tasks/${task._id}`, updated);
    toast.success("Task updated!");
    setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
  } catch (error) {
    toast.error("Update failed!");
    console.error(error);
  }
};


  const downloadPDF = (task) => {
    const doc = new jsPDF();
    doc.text(`Task: ${task.title}`, 10, 10);
    doc.text(`Priority: ${task.priority}`, 10, 20);
    doc.text(`Due: ${task.dueDate}`, 10, 30);
    doc.text(`Description: ${task.description || "None"}`, 10, 40);
    doc.save(`${task.title}.pdf`);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid md:grid-cols-3 gap-4">
        {grouped.map(({ title, items }) => (
          <Droppable droppableId={title} key={title}>
            {(provided) => (
              <div
                className="bg-white rounded shadow p-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-xl font-semibold mb-3">{title}</h2>
                {items.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-gray-50 p-3 mb-2 rounded border hover:shadow-sm"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h3 className="font-bold">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Due: {task.dueDate}
                        </p>
                        <span
                          className={`inline-block mb-2 text-xs px-2 py-1 rounded-full ${
                            task.priority === "High"
                              ? "bg-red-200"
                              : task.priority === "Medium"
                              ? "bg-yellow-200"
                              : "bg-green-200"
                          }`}
                        >
                          {task.priority}
                        </span>

                        <div className="flex justify-between text-xs mt-2">
                          <button
                            className="text-blue-500"
                            onClick={() => downloadPDF(task)}
                          >
                            PDF
                          </button>
                          <button
                            className="text-green-500"
                            onClick={() => editTask(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500"
                            onClick={() => deleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskBoard;
