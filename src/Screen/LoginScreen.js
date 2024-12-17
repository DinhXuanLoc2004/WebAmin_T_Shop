import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../helper/axiosIntercreptor";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import "../Css/Spinner.css";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyAyAXpz90m27RtzQ86tm3TZenmPcGvZyeE",
  authDomain: "back-end-t-shop.firebaseapp.com",
  databaseURL: "https://back-end-t-shop-default-rtdb.firebaseio.com",
  projectId: "back-end-t-shop",
  storageBucket: "back-end-t-shop.appspot.com",
  messagingSenderId: "139108154186",
  appId: "1:139108154186:web:c73ef4350e00b23a721fb3",
  measurementId: "G-E03GQR5Z2Z",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const generateToken = async (id) => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BEm6eOKiNtv7_RufJJLzUleks9uFa-E1apoJkJFLvfksO7886sd6btxAQhJmo3zn41VmayZRM4nT7c_MkHgOqrI",
    });
    console.log('FCM wed nè : ',token)
    if (token) {
      try {
        const response = await axiosInstance.put("admin/set_fcm_admin", {
          _id: id,
          fcm: token,
        });
        console.log("FCM token đã set vô thành công :", response.data.metadata);
      } catch (error) {
        console.error("Lỗi khi gửi FCM token lên server:", error);
      }
    }
  } else {
    console.log("Permission denied for notifications");
  }
};
export default function LoginScreen({ onLogin }) {
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/admin/login_admin", {
        email: email,
        password: password,
      });

      if (response.data.status === 200) {
        setId(response.data.metadata._id);
        onLogin();
        navigate("/dashboard");

        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        generateToken(response.data.metadata._id);
      } else {
        setError("Invalid email or password!");
      }
    } catch (error) {
      setError("Something went wrong. Please try again!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={styles.optionText}>
          <div style={{ flex: "row" }}>
            <input
              style={{ height: 20, width: 20 }}
              type="checkbox"
              id="myCheckbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="myCheckbox">Remember me</label>
          </div>
          <span style={{ color: "red", marginRight: 80 }}>Forget Password</span>
        </div>

        <button
          disabled={isLoading}
          style={styles.button}
          title="Login"
          onClick={handleLogin}
        >
          {isLoading ? (
            <div style={styles.spinnerContainer}>
              <div className="spinner"></div>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}

const styles = {
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  gradientStyle: {
    background: "linear-gradient(to bottom, red, white)",
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
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
    border: "none",
    outline: "none",
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
