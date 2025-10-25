import React, { useState, useEffect } from "react";
import axiosInstance from "../helper/axiosIntercreptor";
export default function Vouchers() {
  const [searchItem, setSearchItem] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailvoucher, setDetailvoucher] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [editVoucher, setEditVoucher] = useState({
    _id: "",
    voucher_name: "",
    voucher_description: "",
    voucher_type: "deduct_money",
    voucher_value: 0,
    voucher_code: "",
    time_start: "",
    time_end: "",
    quantity: 0,
    is_active: true,
    min_order_value: 0,
    is_voucher_new_user: false,
    user: [],
    image_voucher: null,
  });

  const [newVoucher, setNewVoucher] = useState({
    voucher_name: "",
    voucher_description: "",
    voucher_type: "deduct_money",
    voucher_value: 0,
    voucher_code: "",
    time_start: "",
    time_end: "",
    quantity: 0,
    min_order_value: 0,
    is_active: true,
    is_voucher_new_user: false,
    user: [],
    image_voucher: null,
  });
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("auth/get_all_users");
      setUsers(response.data.metadata);
      console.log("thong tin user ", response.data.metadata);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await axiosInstance.get(
        "voucher/get_all_vouchers/admin"
      );
      setVouchers(response.data.metadata);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchUsers();
  }, []);

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image_voucher" && files && files[0]) {
      const imageFile = files[0];
      setEditVoucher((prev) => ({
        ...prev,
        image_voucher: imageFile,
      }));
    } else if (name === "user") {
      // Handle multiple users as an array
      const selectedUsers = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setEditVoucher((prev) => ({
        ...prev,
        user: selectedUsers, // Set it as an array of user IDs
      }));
    } else {
      setEditVoucher((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleDelete = async (voucherId) => {
    try {
      const response = await axiosInstance.put(
        `voucher/toggle_active_voucher?_id=${voucherId}`
      );

      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher._id === voucherId
            ? { ...voucher, is_active: !voucher.is_active }
            : voucher
        )
      );

      alert("Voucher delete successfully!");
    } catch (error) {
      console.error("Error deactivating voucher:", error);
      alert("Error updating voucher status.");
    }
  };

  const handleAddChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image_voucher" && files && files[0]) {
      const imageFile = files[0];
      setNewVoucher((prev) => ({
        ...prev,
        image_voucher: imageFile,
      }));
    } else if (name === "user") {
      // Handle multiple users as an array
      const selectedUsers = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setNewVoucher((prev) => ({
        ...prev,
        user: selectedUsers, // Set it as an array of user IDs
      }));
    } else {
      setNewVoucher((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleEdit = (voucher) => {
    setEditVoucher({
      ...voucher,
      time_start: voucher.time_start ? voucher.time_start.slice(0, 16) : "",
      time_end: voucher.time_end ? voucher.time_end.slice(0, 16) : "",
    });
    setShowEditModal(true);
  };
  const handleAdd = async () => {
    const formData = new FormData();
    Object.entries(newVoucher).forEach(([key, value]) => {
      if (key === "image_voucher" && value instanceof File) {
        formData.append("image", value);
      } else if (
        key === "user" &&
        Array.isArray(value) &&
        newVoucher.is_voucher_new_user
      ) {
        formData.append("users", JSON.stringify(value));
      } else if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    try {
      const response = await axiosInstance.post(
        "voucher/create_voucher",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Voucher added successfully!");
      setVouchers([...vouchers, response.data.metadata]);
      setShowAddModal(false);
      setNewVoucher({
        voucher_name: "",
        voucher_description: "",
        voucher_type: "deduct_money",
        voucher_value: 0,
        voucher_code: "",
        time_start: "",
        time_end: "",
        quantity: 0,
        min_order_value: 0,
        is_voucher_new_user: false,
        user: [],
        image_voucher: null,
      });
    } catch (error) {
      console.error("Error adding voucher:", error);
      alert("Failed to add voucher.");
    }
  };

  const handleSubmitEdit = async () => {
    const formData = new FormData();

    Object.entries(editVoucher).forEach(([key, value]) => {
      if (key === "image_voucher" && value instanceof File) {
        formData.append("image", value);
      } else if (
        key === "user" &&
        Array.isArray(value) &&
        editVoucher.is_voucher_new_user
      ) {
        formData.append("users", JSON.stringify(value));
      } else if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    try {
      const response = await axiosInstance.put(
        `voucher/update_voucher?_id=${editVoucher._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Voucher updated successfully!");
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher._id === response.data.metadata._id
            ? response.data.metadata
            : voucher
        )
      );
      setShowEditModal(false);
      setEditVoucher({
        _id: "",
        voucher_name: "",
        voucher_description: "",
        voucher_type: "deduct_money",
        voucher_value: 0,
        voucher_code: "",
        time_start: "",
        time_end: "",
        quantity: 0,
        min_order_value: 0,
        is_voucher_new_user: false,
        user: [],
        image_voucher: null,
      });
    } catch (error) {
      console.error("Error updating voucher:", error);
      alert("Failed to update voucher.");
    }
  };
  const handleCancel = () => {
    setShowAddModal(false);
    setShowEditModal(false);

    setShowDetailModal(false);
  };

  const filteredItems = vouchers.filter(
    (voucher) =>
      voucher.is_active === true &&
      voucher.voucher_code &&
      voucher.voucher_code.toLowerCase().includes(searchItem.toLowerCase())
  );

  const handleDetailvoucher = async (voucherId) => {
    try {
      const response = await axiosInstance.get(
        `voucher/get_voucher_detail_update?_id=${voucherId}`
      );
      console.log("data voucher detail : ", response.data.metadata[0]);
      if (response.data.metadata) {
        setDetailvoucher(response.data.metadata[0]);
        setShowDetailModal(true);
      } else {
        alert("No sale details found.");
      }
    } catch (err) {
      console.error("Error fetching sale details:", err);
      alert("Failed to fetch sale details. Please try again.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      vouchers.forEach((voucher) => {
        const expiryDate = new Date(voucher.time_end);
        if (voucher.is_active && expiryDate <= now) {
          handleDelete(voucher._id);
        }
      });
    }, 60000); // Kiểm tra mỗi 60 giây
  
    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [vouchers]);
  
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInput}
      />
      <button onClick={() => setShowAddModal(true)} style={styles.addButton}>
        Add New Voucher
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>STT</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Image</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher name</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher type</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher value</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher code</th>
            <th style={{ ...styles.thTd, ...styles.th }}>MFG Date</th>
            <th style={{ ...styles.thTd, ...styles.th }}>EXP Date</th>
            <th style={{ ...styles.thTd, ...styles.th }}>
              Voucher description
            </th>
            <th style={{ ...styles.thTd, ...styles.th }}>Action</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Action</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((voucher, index) => (
            <tr key={voucher._id}>
              <td style={styles.thTd}>{index + 1}</td>
              <td style={styles.thTd}>
                {voucher.image_voucher && (
                  <img
                    src={voucher.image_voucher.url || "default-image-url.jpg"}
                    alt="Voucher"
                    style={styles.imageStyle}
                  />
                )}
              </td>
              <td style={styles.thTd}>{voucher.voucher_name}</td>
              <td style={styles.thTd}>{voucher.voucher_type}</td>
              <td style={styles.thTd}>
                {voucher.voucher_type === "percent"
                  ? `${voucher.voucher_value}%`
                  : `${voucher.voucher_value} VND`}
              </td>
              <td style={styles.thTd}>{voucher.voucher_code}</td>
              <td style={styles.thTd}>
                {new Date(voucher.time_start).toLocaleDateString()}
              </td>
              <td style={styles.thTd}>
                {new Date(voucher.time_end).toLocaleDateString()}
              </td>
              <td style={styles.thTd}>
                <p style={styles.description}>{voucher.voucher_description}</p>
              </td>
              <td style={styles.thTd}>
                <button
                  onClick={() => handleEdit(voucher)}
                  style={styles.editButton}
                >
                  Edit
                </button>
              </td>
              <td style={styles.thTd}>
                <button
                  onClick={() => handleDelete(voucher._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>

              <td style={styles.thTd}>
                <button
                  onClick={() => handleDetailvoucher(voucher._id)}
                  style={styles.detailButton}
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetailModal && (
        <div
          style={{
            ...styles.modal,
            ...(showDetailModal && styles.modalVisible),
          }}
        >
          <div style={styles.modalContent}>
            <button onClick={handleCancel} style={styles.closeButton}>
              &times;
            </button>
            <h2 style={styles.modalTitle}>Voucher Detail</h2>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Voucher Name:</h4>
                <p style={styles.detailValue}>{detailvoucher.voucher_name}</p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Voucher Description:</h4>
                <p style={styles.detailValue}>
                  {detailvoucher.voucher_description}
                </p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Voucher Type:</h4>
                <p style={styles.detailValue}>{detailvoucher.voucher_type}</p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Voucher Value:</h4>
                <p style={styles.detailValue}>
                  {detailvoucher.voucher_type === "percent"
                    ? `${detailvoucher.voucher_value}%`
                    : `${detailvoucher.voucher_value} VND`}
                </p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Voucher Code:</h4>
                <p style={styles.detailValue}>{detailvoucher.voucher_code}</p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Start Date:</h4>
                <p style={styles.detailValue}>
                  {new Date(detailvoucher.time_start).toLocaleString()}
                </p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>End Date:</h4>
                <p style={styles.detailValue}>
                  {new Date(detailvoucher.time_end).toLocaleString()}
                </p>
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Voucher Image:</h4>
                <img
                  src={
                    detailvoucher.image_voucher?.url || "default-image-url.jpg"
                  }
                  alt={detailvoucher.voucher_name}
                  style={styles.saleImage}
                />
              </div>
            </div>

            <div style={styles.productList}>
              <h3 style={styles.productListTitle}>
                This voucher is valid for:
              </h3>
              <ul style={styles.productListItems}>
                {detailvoucher.voucher_users &&
                Array.isArray(detailvoucher.voucher_users) &&
                detailvoucher.voucher_users.length > 0 ? (
                  detailvoucher.voucher_users.map((voucherUser) => (
                    <li key={voucherUser._id} style={styles.productItem}>
                      <p style={styles.productText}>
                        <strong>Email người dùng:</strong>{" "}
                        {voucherUser.user.email}
                      </p>
                    </li>
                  ))
                ) : (
                  <li style={styles.productItem}>All</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={styles.modal}>
          <h2 style={styles.modalHeader}>Edit Voucher</h2>
          <input
            type="text"
            name="voucher_name"
            placeholder="Voucher Name"
            value={editVoucher.voucher_name}
            onChange={handleEditChange}
            style={styles.input}
          />
          <textarea
            name="voucher_description"
            placeholder="Voucher Description"
            value={editVoucher.voucher_description}
            onChange={handleEditChange}
            style={styles.textarea}
          />

          {editVoucher.image_voucher && editVoucher.image_voucher.url && (
            <div>
              <img
                src={editVoucher.image_voucher.url}
                alt="Current Voucher"
                style={styles.imageStyle}
              />
            </div>
          )}
          <input
            type="file"
            name="image_voucher"
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="text"
            name="voucher_code"
            placeholder="Voucher Code"
            value={editVoucher.voucher_code}
            onChange={handleEditChange}
            style={styles.input}
          />
          <div style={styles.timeInputContainer}>
            <input
              type="datetime-local"
              name="time_start"
              value={editVoucher.time_start}
              onChange={handleEditChange}
              style={styles.input}
            />
            <input
              type="datetime-local"
              name="time_end"
              value={editVoucher.time_end}
              onChange={handleEditChange}
              style={styles.input}
            />
          </div>
          <input
            type="number"
            name="voucher_value"
            placeholder="Voucher Value"
            value={editVoucher.voucher_value}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={editVoucher.quantity}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="number"
            name="min_order_value"
            placeholder="Min Order Value"
            value={editVoucher.min_order_value}
            onChange={handleEditChange}
            style={styles.input}
          />
          <label>
            New User Only
            <input
              type="checkbox"
              name="is_voucher_new_user"
              checked={editVoucher.is_voucher_new_user}
              onChange={handleEditChange}
              style={styles.checkbox}
            />
          </label>

          {editVoucher.is_voucher_new_user && (
            <select
              name="user"
              value={editVoucher.user}
              onChange={handleEditChange}
              style={styles.input}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.email}
                </option>
              ))}
            </select>
          )}

          <label>
            Voucher Type
            <select
              name="voucher_type"
              value={editVoucher.voucher_type}
              onChange={handleEditChange}
              style={styles.input}
            >
              <option value="deduct_money">Deduct Money</option>
              <option value="percent">Percent</option>
            </select>
          </label>

          <button onClick={handleSubmitEdit} style={styles.submitButton}>
            Save Voucher
          </button>
          <button
            onClick={() => setShowEditModal(false)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      )}
      {showAddModal && (
        <div style={styles.modal}>
          <h2 style={styles.modalHeader}>Add Voucher</h2>
          <input
            type="text"
            name="voucher_name"
            placeholder="Voucher Name"
            value={newVoucher.voucher_name}
            onChange={handleAddChange}
            style={styles.input}
          />
          <textarea
            name="voucher_description"
            placeholder="Voucher Description"
            value={newVoucher.voucher_description}
            onChange={handleAddChange}
            style={styles.textarea}
          />
          <input
            type="file"
            name="image_voucher"
            onChange={handleAddChange}
            style={styles.input}
          />
          <input
            type="text"
            name="voucher_code"
            placeholder="Voucher Code"
            value={newVoucher.voucher_code}
            onChange={handleAddChange}
            style={styles.input}
          />
          <div style={styles.timeInputContainer}>
            <input
              type="datetime-local"
              name="time_start"
              value={newVoucher.time_start}
              onChange={handleAddChange}
              style={styles.input}
            />
            <input
              type="datetime-local"
              name="time_end"
              value={newVoucher.time_end}
              onChange={handleAddChange}
              style={styles.input}
            />
          </div>
          <input
            type="number"
            name="voucher_value"
            placeholder="Voucher Value"
            value={newVoucher.voucher_value}
            onChange={handleAddChange}
            style={styles.input}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newVoucher.quantity}
            onChange={handleAddChange}
            style={styles.input}
          />
          <input
            type="number"
            name="min_order_value"
            placeholder="Min Order Value"
            value={newVoucher.min_order_value}
            onChange={handleAddChange}
            style={styles.input}
          />
          <label>
            New User Only
            <input
              type="checkbox"
              name="is_voucher_new_user"
              checked={newVoucher.is_voucher_new_user}
              onChange={handleAddChange}
              style={styles.checkbox}
              zz
            />
          </label>
          {newVoucher.is_voucher_new_user && (
            <select
              name="user"
              value={newVoucher.user}
              onChange={handleAddChange}
              style={styles.input}
            >
              <option value="">Select User (If new user only)</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.email} {/* Hiển thị email ở đây */}
                </option>
              ))}
            </select>
          )}

          <label>
            Voucher Type
            <select
              name="voucher_type"
              value={newVoucher.voucher_type}
              onChange={handleAddChange}
              style={styles.input}
            >
              <option value="deduct_money">Deduct Money</option>
              <option value="percent">Percent</option>
            </select>
          </label>

          <button onClick={handleAdd} style={styles.submitButton}>
            Add Voucher
          </button>
          <button
            onClick={() => setShowAddModal(false)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    margin: "0 auto",
    paddingTop: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thTd: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  },
  imageStyle: {
    width: "60px",
    height: "60px",
    borderRadius: "5px",
  },
  description: {
    maxWidth: "250px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "30px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
    borderRadius: "10px",
    width: "90%",
    maxWidth: "800px",
    overflowY: "auto",
    maxHeight: "80vh",
  },
  modalHeader: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    fontSize: "16px",
    minHeight: "100px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  timeInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  checkbox: {
    marginLeft: "10px",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    marginTop: "10px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "12px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    marginLeft: "10px",
  },
  addButton: {
    padding: "12px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
    borderRadius: "8px",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
  },
  detailButton: {
    backgroundColor: "blue",
    color: "white",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
  },
  modalVisible: {
    opacity: 1,
    visibility: "visible",
  },
  modalTitle: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "25px",
    textAlign: "center",
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    border: "none",
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  },
  detailSection: {
    marginBottom: "20px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: "18px",
    flex: 1,
    textAlign: "left",
    color: "#555",
  },
  detailValue: {
    fontSize: "18px",
    flex: 2,
    textAlign: "right",
    color: "#333",
    wordBreak: "break-word",
  },
  saleImage: {
    maxWidth: "10%",
    height: "auto",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  productList: {
    marginTop: "30px",
  },
  productListTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  productListItems: {
    listStyleType: "none",
    padding: "0",
  },
  productItem: {
    marginBottom: "20px",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  productText: {
    fontSize: "16px",
    margin: "8px 0",
    color: "#555",
  },
};
