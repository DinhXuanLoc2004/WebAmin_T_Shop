import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faUndo } from "@fortawesome/free-solid-svg-icons"; // Adding the faUndo icon for Unblock

export default function ManageUser() {
  const [searchItem, setSearchItem] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users when component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/v1/api/auth/get_all_users");
        setUsers(response.data.metadata);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []); // Initially fetch users when component mounts

  const handleBlock = async (email) => {
    try {
      // Send request to update the user's status
      const response = await axios.put(`http://localhost:5000/v1/api/auth/update_status_user?email=${email}`);
      
      // Re-fetch users after the status update
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:5000/v1/api/auth/get_all_users");
          setUsers(response.data.metadata);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      // Call fetchUsers to reload the users list with updated statuses
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const filteredItems = users.filter((user) =>
    user.email.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInPut}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>STT</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Email</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Created At</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Update At</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((user, index) => (
            <tr key={user._id}>
              <td style={styles.thTd}>{index + 1}</td>
              <td style={styles.thTd}>{user.email}</td>
              <td style={styles.thTd}>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td style={styles.thTd}>{new Date(user.updatedAt).toLocaleDateString()}</td>
              <td style={styles.thTd}>
                <span
                  style={{
                    ...styles.status,
                    ...(user.status === "active"
                      ? styles.actionStatus
                      : styles.inactiveStatus),
                  }}
                >
                  {user.status}
                </span>
              </td>
              <td style={styles.thTd}>
                {user.status === "active" ? (
                  <button
                    style={styles.blockBtn}
                    onClick={() => handleBlock(user.email)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.blockBtnHover.backgroundColor)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.blockBtn.backgroundColor)
                    }
                  >
                    <FontAwesomeIcon icon={faBan} /> Block
                  </button>
                ) : (
                  <button
                    style={styles.blockBtn}
                    onClick={() => handleBlock(user.email)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.blockBtnHover.backgroundColor)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        styles.blockBtn.backgroundColor)
                    }
                  >
                    <FontAwesomeIcon icon={faUndo} /> Unblock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  thTd: { padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" },
  th: { backgroundColor: "#f5f5f5" },
  status: { padding: "5px 10px", borderRadius: "12px", color: "white" },
  actionStatus: { backgroundColor: "#007bff", color: "white" },
  inactiveStatus: { backgroundColor: "#dc3545", color: "white" }, 
  blockBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  blockBtnHover: { backgroundColor: "#c82333" },
  searchInPut: {
    padding: "8px 8px 8px 30px",
    width: "45%",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "30px",
  },
};
