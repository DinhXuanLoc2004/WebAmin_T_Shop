import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin(); // Gọi hàm onLogin từ props
    navigate('/dashboard'); // Chuyển đến dashboard
  };

  return (
    <div style={styles.gradientStyle}>
      <div style={styles.container}>
        <div style={styles.textContainer}>
          <div style={styles.welcomeText}>Welcome Admin! Log in to manage</div>
          <p className="tshopText">T shop</p>
        </div>
        <div style={styles.inputContainer}>
          <div style={styles.emailInput}>
            <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
            <input
              style={styles.input}
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.passwordInput}>
            <FontAwesomeIcon icon={faKey} style={styles.icon} />
            <input
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
              required
            />
          </div>
        </div>
        <div style={styles.optionText}>
          <div style={{ flex: "row" }}>
            <input
              style={{ height: 20, width: 20 }}
              type="checkbox"
              id="myCheckbox"
            />
            <label htmlFor="myCheckbox">Remember me</label>
          </div>
          <span style={{ color: "red", marginRight: 80 }}>Forget Password</span>
        </div>
        <button style={styles.button} title="Login" onClick={handleLogin}>
          <span style={styles.buttonText}>Login</span>
        </button>
      </div>
    </div>
  );
}

// Styles remain unchanged


const styles = {
  gradientStyle: {
    background: "linear-gradient(to bottom, red, white)", // Chuyển màu từ đỏ sang trắng
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#000", // Màu chữ
    fontSize: "24px",
  },
  container: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "20px",
    width: "800px",
    height: "900px",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    marginLeft: "70px",
    marginTop: "150px",
  },
  welcomeText: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  emailInput: {
    width: "650px",
    height: "70px",
    borderRadius: "5px",
    backgroundColor: "#ECECEC",
    fontSize: "20px",
    color: "#000",
    flex: "row",
    alignItems: "center",
  },
  passwordInput: {
    width: "650px",
    height: "70px",
    borderRadius: "5px",
    backgroundColor: "#ECECEC",
    fontSize: "20px",
    color: "#000",
    marginTop: "30px",
  },
  inputContainer: {
    flex: "column",
    marginTop: "20px",
    justifyContent: "center",
    marginLeft: "70px",
  },
  input: {
    width: "550px",
    height: "50px",
    backgroundColor: "#ECECEC",
    fontSize: "20px",
    color: "#000",
    paddingLeft: "20px",
    marginTop: "10px",
    border: "none", // This removes the border
    outline: "none",
    fontSize: "25px",
    fontWeight: "bold",
  },
  icon: {
    height: "30px",
    width: "30px",
    marginTop: "10px",
    marginLeft: "20px",
    color: "#000",
  },
  optionText: {
    flex: "row",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
    marginLeft: "70px",
    fontSize: "20px",
    color: "#888",
  },
  button: {
    width: "650px",
    height: "70px",
    marginLeft: "70px",
    marginTop: "50px",
    backgroundColor: "red",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    fontSize: "30px",
  },
};
