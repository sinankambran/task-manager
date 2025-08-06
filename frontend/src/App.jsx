import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import TaskBoard from "./components/TaskBoard";
import TaskFilter from "./components/TaskFilter";
import TaskForm from "./components/TaskForm";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ priority: "", status: "", search: "" });

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filters.priority ? task.priority === filters.priority : true;
    const matchesStatus = filters.status ? task.status === filters.status : true;
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  return (
    <Router>
      <div className="p-4 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-center mb-4">TaskLite</h1>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <TaskForm onAdd={(task) => setTasks((prev) => [...prev, task])} />
                <TaskFilter filters={filters} setFilters={setFilters} />
                <TaskBoard tasks={filteredTasks} setTasks={setTasks} />
              </>
            }
          />
        </Routes>

        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
