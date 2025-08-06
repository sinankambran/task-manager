import React from "react";

const TaskFilter = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        className="border rounded p-2"
      >
        <option value="">All Status</option>
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
        className="border rounded p-2"
      >
        <option value="">All Priorities</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
  );
};

export default TaskFilter;
