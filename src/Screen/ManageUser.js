import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBan, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function ManageUser() {
  const users = [
    {
      id: "709 - 230",
      image: "https://via.placeholder.com/50",
      fullName: "Jádasdack",
      email: "Domdom23aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1@gmail.com",
      status: "Inactive",
      createdAt: "13-9-2010",
      buyed: 234,
    },
    {
      id: "709 - 230",
      image: "",
      fullName: "aaaack",
      email: "Domdom231@gmail.com",
      status: "Action",
      createdAt: "13-9-2010",
      buyed: 234,
    },
    {
      id: "709 - 230",
      image: "https://via.placeholder.com/50",
      fullName: "Sack",
      email: "Domdom231@gmail.com",
      status: "Inactive",
      createdAt: "13-9-2010",
      buyed: 234,
    },
    {
      id: "709 - 230",
      image:
        "data:image/webp;base64,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",
      fullName: "mK",
      email: "Domdom231@gmail.com",
      status: "Inactive",
      createdAt: "13-9-2010",
      buyed: 234,
    },
  ];
  const [searchItem, setSearchItem] = useState("");
  const filteredItems = users.filter((users) =>
    users.fullName.toLowerCase().includes(searchItem.toLowerCase())
  );
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search..."
        value={searchItem} // Gán giá trị của state vào input
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInPut }
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>ID User</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Image</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Full name</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Email</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Created At</th>
            <th style={{ ...styles.thTd, ...styles.th }}></th>
            <th style={{ ...styles.thTd, ...styles.th }}>Buyed</th>
          </tr>
        </thead>
        <tbody style={{ paddingLeft: 100 }}>
          {filteredItems.map((user, index) => (
            <tr key={index}>
              <td style={{ ...styles.thTdTable, width:"90%"}}>{user.id}</td>
              <td style={styles.thTd}>
                {user.image ? (
                  <img src={user.image} alt="User" style={styles.img} />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{
                      color: "white",
                      backgroundColor: "#D2D6DB",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                    }}
                    size="2x"
                  />
                )}
              </td>
              <td style={styles.thTdTable}>{user.fullName}</td>
              <td style={styles.thTdTable}>{user.email}</td>
              <td style={styles.thTd}>
                <span
                  style={{
                    ...styles.status,
                    ...(user.status === "Action"
                      ? styles.actionStatus
                      : styles.inactiveStatus),
                  }}
                >
                  {user.status}
                </span>
              </td>
              <td style={{ ...styles.thTd, width: 70 }}>{user.createdAt}</td>
              <td style={styles.thTd}>
                <button
                  style={styles.blockBtn}
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
              </td>
              <td style={styles.thTd}>{user.buyed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
    container: {
      padding: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    thTd: {
      paddingLeft: "40px",
      paddingRight: "40px",
      paddingTop: "10px",
      fontWeight: "normal",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
      gap: 10,
    },
    thTdTable: {
      paddingLeft: "40px",
      paddingRight: "40px",
      paddingTop: "10px",
      textAlign: "left",
      fontWeight: "bold",
      borderBottom: "1px solid #ddd",
      gap: 10,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth:"200px"
    },
    th: {
      backgroundColor: "#f5f5f5",
    },
    img: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
    },
    status: {
      padding: "5px 10px",
      borderRadius: "12px",
      color: "white",
    },
    actionStatus: {
      backgroundColor: "#d1e7ff",
      color: "#007bff",
    },
    inactiveStatus: {
      backgroundColor: "#d4edda",
      color: "#28a745",
    },
    blockBtn: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    blockBtnHover: {
      backgroundColor: "#c82333",
    },
    h3: {
      fontWeight: "normal",
    },
    searchInPut: {
      padding: "8px 8px 8px 30px",
      width: "45%",
      boxSizing: "border-box",
      borderRadius: "20px",
      outline: "none",
      fontSize: "14px",
      transition: "0.3s",
      marginTop:"10px",
      marginBottom: "30px",
     
    },
  };