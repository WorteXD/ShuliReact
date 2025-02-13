
import React, { useEffect, useState } from "react";
import { db } from "./FireBase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const ArchivedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskContent, setTaskContent] = useState("");

  useEffect(() => {
    const fetchArchivedTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "archived_tasks"));
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksArray);
    };

    fetchArchivedTasks();
  }, []);



  const deleteArchivedTask = async (taskId) => {
    try {
        console.log("Attempting to delete task with Firebase ID:", taskId);

   
        const querySnapshot = await getDocs(collection(db, "archived_tasks"));
        let foundDoc = null;

        querySnapshot.forEach((doc) => {
            if (doc.data().id === taskId || doc.id === taskId) {
                foundDoc = doc.id;
            }
        });

        if (!foundDoc) {
            console.warn("Task not found in Firebase, skipping delete.");
            return;
        }

        await deleteDoc(doc(db, "archived_tasks", foundDoc));

    
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        console.log("Task successfully deleted from Firebase and UI");
    } catch (err) {
        console.error("Error deleting archived task:", err);
    }
};



  
  
  
 
  const handleShowModal = (content) => {
    setTaskContent(content);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Archived Tasks</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Subject</th>
            <th>Assignee</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.subject}</td>
              <td>{task.assignee}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
              <td>
                <button className="btn btn-info btn-sm me-2" onClick={() => handleShowModal(task.content)}>📄 View Content</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteArchivedTask(task.id)}>🗑️ Delete</button>
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

export default ArchivedTasks;
