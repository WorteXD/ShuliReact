import React, { useEffect, useState, useCallback } from "react";
import { db } from "../config/FireBase";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const [showModal, setShowModal] = useState(false);
  const [taskContent, setTaskContent] = useState("");


  const updateSortedTasks = useCallback((tasksArray) => {
    let sortedTasks = [...tasksArray].filter(task =>
      (task.subject && task.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    sortedTasks.sort((a, b) => {
      if (a.status === "Pending" && b.status === "Completed") return -1;
      if (a.status === "Completed" && b.status === "Pending") return 1;
      if (sortBy === "priority") {
        return (a.priority || 0) - (b.priority || 0);
      } else {
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      }
    });

    setTasks(sortedTasks);
  }, [searchTerm, sortBy]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updateSortedTasks(tasksArray);
    };

    fetchTasks();
  }, [updateSortedTasks]);

  
  const markAsCompleted = async (taskId) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { status: "Completed" });
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === taskId ? { ...task, status: "Completed" } : task
        );
        return updatedTasks.sort((a, b) => (a.status === "Pending" ? -1 : 1));
      });
    } catch (err) {
      console.error("Error updating task: ", err);
    }
  };


  const archiveTask = async (task) => {
    try {
      await addDoc(collection(db, "archived_tasks"), task);
      await deleteDoc(doc(db, "tasks", task.id));
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
    } catch (err) {
      console.error("Error archiving task: ", err);
    }
  };


  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task: ", err);
    }
  };

  const handleShowModal = (content) => {
    setTaskContent(content);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Task Manager</h2>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="priority">Sort by Priority</option>
          <option value="date">Sort by Due Date</option>
        </select>
      </div>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Subject</th>
            <th>Assignee</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={task.status === "Completed" ? "table-secondary text-muted" : ""}>
              <td>{task.subject || "No Subject"}</td>
              <td>{task.assignee || "No Assignee"}</td>
              <td>{task.dueDate || "No Date"}</td>
              <td>{task.priority || "N/A"}</td>
              <td>{task.status}</td>
              <td>
                <button className="btn btn-info btn-sm me-2" onClick={() => handleShowModal(task.content)}>📄 View Content</button>
                {task.status === "Pending" && (
                  <button className="btn btn-success btn-sm me-2" onClick={() => markAsCompleted(task.id)}>✔ Complete</button>
                )}
                {task.status === "Completed" && (
                  <button className="btn btn-warning btn-sm me-2" onClick={() => archiveTask(task)}>📂 Archive</button>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Task Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {taskContent || "No content available."}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;
