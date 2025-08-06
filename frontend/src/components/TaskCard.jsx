import React, { useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import { toast } from "react-toastify";

const TaskCard = ({ task, index, setTasks, tasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...task });

  const handleEdit = async () => {
    const res = await axios.put(`http://localhost:5000/tasks/${task._id}`, editForm);
    setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    toast.success("Task updated");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/tasks/${task._id}`);
    setTasks(tasks.filter((t) => t._id !== task._id));
    toast.info("Task deleted");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Title: ${task.title}`, 10, 10);
    doc.text(`Priority: ${task.priority}`, 10, 20);
    doc.text(`Due Date: ${task.dueDate}`, 10, 30);
    doc.text(`Status: ${task.status}`, 10, 40);
    doc.text(`Description:\n${task.description || "-"}`, 10, 50);
    doc.save(`${task.title}.pdf`);
  };

  return (
    <div className="mb-3 p-3 bg-gray-50 border rounded shadow-sm">
      {isEditing ? (
        <>
          <input className="border p-1 w-full mb-1" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
          <textarea className="border p-1 w-full mb-1" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}></textarea>
          <div className="flex gap-2">
            <button onClick={handleEdit} className="bg-green-500 px-2 text-white rounded text-sm">Save</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-400 px-2 text-white rounded text-sm">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-bold">{task.title}</h3>
          <p className="text-sm">Due: {task.dueDate}</p>
          <p className="text-xs text-gray-600">Priority: {task.priority}</p>
          <p className="text-xs text-gray-600">{task.description}</p>
          <div className="mt-2 flex gap-2 text-xs">
            <button onClick={downloadPDF} className="text-blue-500 underline">Download PDF</button>
            <button onClick={() => setIsEditing(true)} className="text-yellow-600 underline">Edit</button>
            <button onClick={handleDelete} className="text-red-500 underline">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
