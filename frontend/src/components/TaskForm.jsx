import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TaskForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Low",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/tasks", formData);
      onAdd(res.data);
      toast.success("Task Created!");
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Low",
        dueDate: "",
      });
    } catch (err) {
      toast.error("Error creating task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 mb-6 rounded-md">
      <h2 className="text-xl font-bold mb-4">Create Task</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <select name="priority" value={formData.priority} onChange={handleChange} className="border rounded p-2">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange} className="border rounded p-2">
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="md:col-span-2 border rounded p-2"
        ></textarea>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
