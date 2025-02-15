import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import ArchivedTasks from "./ArchivedTasks";
import Navbar from "./Navbar"; 
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/add-task" element={<TaskForm />} />
          <Route path="/archived-tasks" element={<ArchivedTasks />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
