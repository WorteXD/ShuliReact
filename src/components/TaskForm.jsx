import React, { useState } from "react";
import { db } from "../config/FireBase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const TaskForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    assignee: "",
    dueDate: "",
    priority: "1",
    content: "", 
    status: "Pending",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tasks"), formData);
      setFormData({ subject: "", assignee: "", dueDate: "", priority: "1", content: "", status: "Pending" });
      alert("Task added successfully!");
    } catch (err) {
      console.error("Error adding task: ", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-primary text-center">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Task Subject</label>
            <input type="text" name="subject" className="form-control" value={formData.subject} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Assignee</label>
            <input type="text" name="assignee" className="form-control" value={formData.assignee} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Due Date</label>
            <input type="date" name="dueDate" className="form-control" value={formData.dueDate} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Priority</label>
            <select name="priority" className="form-select" value={formData.priority} onChange={handleChange} required>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Task Content</label>
            <textarea name="content" className="form-control" value={formData.content} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success w-100">Add Task</button>
        </form>
        <button className="btn btn-secondary mt-3 w-100" onClick={() => navigate("/")}>Back to Task List</button>
      </div>
    </div>
  );
};

export default TaskForm;
