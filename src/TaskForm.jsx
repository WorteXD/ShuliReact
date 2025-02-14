import React, { useState } from "react";
import { db } from "./FireBase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const TaskForm = () => {
  // ניהול נתוני הטופס
  const [formData, setFormData] = useState({
    subject: "", // נושא המשימה
    assignee: "", // מבצע המשימה
    dueDate: "", // תאריך יעד
    priority: "1", // 
    content: "", // תוכן המשימה
    status: "Pending", // סטטוס המשימה (ברירת מחדל - "Pending")
  });

  const navigate = useNavigate();

  // פונקציה שמעדכנת את ה-state של הנתונים בהתאם לשינויים בטופס
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // פונקציה שמטפלת בשליחת הנתונים ל-Firebase
  const handleSubmit = async (e) => {
    e.preventDefault(); // מונע רענון דף בעת שליחת הטופס
    try {
      await addDoc(collection(db, "tasks"), formData); // הוספת המשימה למסד הנתונים
      // איפוס הטופס לאחר הוספת המשימה
      setFormData({ subject: "", assignee: "", dueDate: "", priority: "1", content: "", status: "Pending" });
      alert("Task added successfully!"); // הודעה למשתמש
    } catch (err) {
      console.error("Error adding task: ", err); // טיפול בשגיאה
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
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
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
