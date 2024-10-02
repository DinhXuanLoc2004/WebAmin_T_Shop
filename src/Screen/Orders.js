import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteDialog from "../component/DeleteDialog";

export default function Orders() {
  const order = [
    {
      id: "709 - 230",
      fullName: "Jádasdack",
      customer: "Domdom23aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1@gmail.com",
      status: "Complete",
      createdAt: "13-9-2010",
      deadline: "18-9-2010",
      price: 234,
    },
    {
      id: "709 - 230",
      fullName: "Jádasdack",
      customer: "Domdom23aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1@gmail.com",
      status: "Pending",
      createdAt: "13-9-2010",
      deadline: "18-9-2010",
      price: 234,
    },
    {
      id: "709 - 230",
      fullName: "Jádasdack",
      customer: "Domdom23aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1@gmail.com",
      status: "Rejected",
      createdAt: "13-9-2010",
      deadline: "18-9-2010",
      price: 234,
    },
  ];
  const [searchItem, setSearchItem] = useState("");
  const filteredItems = order.filter((order) =>
    order.fullName.toLowerCase().includes(searchItem.toLowerCase())
  );
  const [showAlert, setShowAlert] = useState(false);

  const handleOpen = () => setShowAlert(true);
  const handleClose = () => setShowAlert(false);
  const handleConfirm = () => {
    console.log("Xóa dữ liệu");
    handleClose();
  };
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search..."
        value={searchItem} // Gán giá trị của state vào input
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInPut}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>ID User</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Product</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Customer</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Created At</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Deadline</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Price</th>
            <th style={{ ...styles.thTd, ...styles.th }}></th>
            <th style={{ ...styles.thTd, ...styles.th }}></th>
          </tr>
        </thead>
        <tbody style={{ paddingLeft: 100 }}>
          {filteredItems.map((order, index) => (
            <tr key={index}>
              <td style={{ ...styles.thTdTable, width: "90%" }}>{order.id}</td>

              <td style={styles.thTdTable}>{order.fullName}</td>
              <td style={styles.thTdTable}>{order.customer}</td>
              <td style={styles.thTd}>
                <span
                  style={{
                    ...styles.status,
                    ...(order.status === "Complete"
                      ? styles.completeStatus
                      : order.status === "Pending"
                      ? styles.pendingStatus
                      : styles.rejectStatus),
                  }}
                >
                  {order.status}
                </span>
              </td>
              <td style={{ ...styles.thTd, width: 70 }}>{order.createdAt}</td>
              <td style={{ ...styles.thTd, width: 70 }}>{order.deadline}</td>
              <td style={{ ...styles.thTdTable, width: 70 }}>{order.price}</td>

              <td style={styles.thTd}>
                <button
                  style={styles.editBtn}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.editBtn.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.editBtnHover.backgroundColor)
                  }
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              </td>
              <td style={{ ...styles.thTd, paddingLeft: 10 }}>
                <button
                  onClick={handleOpen}
                  style={styles.deletekBtn}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.deletekBtn.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.deleteBtnHover.backgroundColor)
                  }
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
                <DeleteDialog
                  open={showAlert}
                  onClose={handleClose}
                  onConfirm={handleConfirm}
                />
              </td>
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
    maxWidth: "200px",
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
  completeStatus: {
    backgroundColor: "#d1e7ff",
    color: "#007bff",
  },
  pendingStatus: {
    backgroundColor: "yellow",
    color: "#28a745",
  },
  rejectStatus: {
    backgroundColor: "#d4edda",
    color: "#28a745",
  },
  editBtn: {
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    width: 70,
    height: 40,
  },
  editBtnHover: {
    backgroundColor: "#003CFF",
  },
  deletekBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    width: 80,
    height: 40,
  },
  deleteBtnHover: {
    backgroundColor: "#c82333",
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
    marginTop: "10px",
    marginBottom: "30px",
  },
};
