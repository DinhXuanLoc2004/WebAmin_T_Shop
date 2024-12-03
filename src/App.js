import Navigation from "./navigation/Navigation";
import LoginScreen from "./Screen/LoginScreen";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { generateToken, messaging } from "./config/firebase-config";
import { onMessage } from "firebase/messaging";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      const { title, body, image } = payload.notification;

      toast(
        <div style={{ display: "flex", alignItems: "center" }}>
          {image && (
            <img
              src={image}
              alt="notification"
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
          )}
          <div>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        </div>
      );
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        <Route
          path="/*"
          element={isLoggedIn ? <Navigation /> : <Navigate to="/login" />}
        />
      </Routes>

      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;
