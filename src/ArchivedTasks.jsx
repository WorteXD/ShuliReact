// 📌 ייבוא ספריות נדרשות
import React, { useEffect, useState } from "react"; // שימוש ב-React עם useState ו-useEffect לניהול מצב והרצת קוד בזמן טעינת הקומפוננטה
import { db } from "./FireBase"; // ייבוא הגדרות ה-Firebase שלנו
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // פונקציות של Firestore לקריאה ומחיקה של מסמכים
import "bootstrap/dist/css/bootstrap.min.css"; // ייבוא עיצוב Bootstrap
import { Modal, Button } from "react-bootstrap"; // ייבוא רכיבי Bootstrap לשימוש ב-Modal

// 📌 קומפוננטת ArchivedTasks - מציגה את רשימת המשימות שהושלמו
const ArchivedTasks = () => {
  // 📌 משתנים לניהול מצב (State)
  const [tasks, setTasks] = useState([]); // מחזיק את רשימת המשימות שהועברו לארכיון
  const [showModal, setShowModal] = useState(false); // קובע האם להציג את ה-Modal או לא
  const [taskContent, setTaskContent] = useState(""); // מכיל את תוכן המשימה שמוצג ב-Modal

  // 📌 הבאת המשימות מהארכיון בעת טעינת הקומפוננטה
  useEffect(() => {
    const fetchArchivedTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "archived_tasks")); // קבלת כל המשימות מאוסף ה-archived_tasks ב-Firebase
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id, // שמירת מזהה Firebase לכל משימה
        ...doc.data(), // הוספת שאר המידע של המשימה
      }));
      setTasks(tasksArray); // עדכון ה- state עם המשימות מהארכיון
    };

    fetchArchivedTasks(); // קריאה ראשונית לפונקציה
  }, []); // [] מבטיח שהפונקציה תרוץ רק פעם אחת כשהקומפוננטה נטענת

  // 📌 פונקציה למחיקת משימה מהארכיון
  const deleteArchivedTask = async (taskId) => {
    try {
      console.log("Attempting to delete task with Firebase ID:", taskId);

      // חיפוש המסמך ב-Firebase שמכיל את ה-ID המתאים
      const querySnapshot = await getDocs(collection(db, "archived_tasks"));
      let foundDoc = null;

      querySnapshot.forEach((doc) => {
        if (doc.data().id === taskId || doc.id === taskId) {
          foundDoc = doc.id; // שמירת המזהה האמיתי של Firebase
        }
      });

      if (!foundDoc) {
        console.warn("Task not found in Firebase, skipping delete."); // אם המשימה לא נמצאה, הודעה בקונסול
        return;
      }

      await deleteDoc(doc(db, "archived_tasks", foundDoc)); // מחיקת המשימה מ-Firebase
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // עדכון ה-UI כדי שהמשימה תימחק גם במסך

      console.log("Task successfully deleted from Firebase and UI");
    } catch (err) {
      console.error("Error deleting archived task:", err); // טיפול בשגיאות אם המחיקה נכשלה
    }
  };

  // 📌 פונקציה לפתיחת חלון ה-Modal עם תוכן המשימה
  const handleShowModal = (content) => {
    setTaskContent(content); // קביעת התוכן שיוצג ב-Modal
    setShowModal(true); // הצגת החלון
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Archived Tasks</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Subject</th> {/* נושא המשימה */}
            <th>Assignee</th> {/* שם המבצע */}
            <th>Due Date</th> {/* תאריך יעד */}
            <th>Priority</th> {/* עדיפות */}
            <th>Actions</th> {/* פעולות זמינות */}
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
                {/* כפתור לפתיחת תוכן המשימה */}
                <button className="btn btn-info btn-sm me-2" onClick={() => handleShowModal(task.content)}>📄 View Content</button>
                {/* כפתור למחיקת משימה מהארכיון */}
                <button className="btn btn-danger btn-sm" onClick={() => deleteArchivedTask(task.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 חלון קופץ להצגת תוכן המשימה */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Task Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {taskContent || "No content available."} {/* אם אין תוכן, מציג הודעה ברירת מחדל */}
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

export default ArchivedTasks; // ייצוא הקומפוננטה לשימוש בקובצי React אחרים
