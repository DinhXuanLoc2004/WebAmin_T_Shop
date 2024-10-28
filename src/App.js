import Navigation from "./navigation/Navigation";
import LoginScreen from "./Screen/LoginScreen";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Quản lý trạng thái đăng nhập

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
      <Route
        path="/*"
        element={isLoggedIn ? <Navigation /> : <Navigate to="/login" />}
      />
    </Routes>
  </Router>
  );
}

export default App;
