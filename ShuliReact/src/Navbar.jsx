import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

const Navbar = () => {
  const [quote, setQuote] = useState("");
  const [fade, setFade] = useState("animate__fadeIn");
  const [backgroundImage, setBackgroundImage] = useState("");


  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/get?url=";
        const apiUrl = encodeURIComponent(`https://zenquotes.io/api/random?timestamp=${new Date().getTime()}`);
        const response = await fetch(proxyUrl + apiUrl);

        if (!response.ok) throw new Error("Failed to fetch quote");
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);
        
        setFade("animate__fadeOut");
        setTimeout(() => {
          setQuote(`"${parsedData[0].q}" - ${parsedData[0].a}`);
          setFade("animate__fadeIn");
        }, 500);
      } catch (err) {
        console.error("Error fetching quote:", err);
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 20000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const API_KEY = "fQBfuh7NfvNcrmG9Q2WhBUNwcmdxA3ZIwGuQrsYc";  
        const response = await fetch(`https://api.nasa.gov/planetary/apod?count=1&api_key=${API_KEY}`);


        if (!response.ok) throw new Error("Failed to fetch NASA image");
        const data = await response.json();
        
        setBackgroundImage(data[0].hdurl || data[0].url); 
      } catch (err) {
        console.error("Error fetching NASA image:", err);
      }
    };

    fetchBackgroundImage();
    const interval = setInterval(fetchBackgroundImage, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -1,
        transition: "opacity 1s ease-in-out"
      }}></div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">Task Manager</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-task">Add Task</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/archived-tasks">Archived Tasks</Link>
              </li>
            </ul>
          </div>
          <div className={`ms-3 text-white text-center animate__animated ${fade}`} style={{ maxWidth: "300px", fontSize: "0.9rem" }}>
            <span>💡 {quote || "Loading quote..."}</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
