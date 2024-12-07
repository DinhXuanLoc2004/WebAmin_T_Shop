import React, { useState, useEffect } from "react";
import axiosInstance from "../helper/axiosIntercreptor";
export default function Vouchers() {
  const [searchItem, setSearchItem] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
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
    min_order_value: 0,
    is_voucher_new_user: false,
    user_id: "",
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
    is_voucher_new_user: false,
    user_id: "",
    image_voucher: null,
  });

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
  }, []);

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image_voucher" && files && files[0]) {
      const imageFile = files[0];
      setEditVoucher((prev) => ({
        ...prev,
        image_voucher: imageFile,
      }));
    } else {
      setEditVoucher((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,  
      }));
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
      } else if (value !== null && value !== "") {
        if (key === 'quantity') {
          formData.append(key, Number(value))
        } else { 
          formData.append(key, value);
        }
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
        user_id: "",
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
        user_id: "",
        image_voucher: null,
      });
    } catch (error) {
      console.error("Error updating voucher:", error);
      alert("Failed to update voucher.");
    }
  };

  const filteredItems = vouchers.filter(
    (voucher) =>
      voucher.voucher_code &&
      voucher.voucher_code.toLowerCase().includes(searchItem.toLowerCase())
  );

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
            <th style={{ ...styles.thTd, ...styles.th }}>Actions</th>
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
            </tr>
          ))}
        </tbody>
      </table>

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
            />
          </label>
          {newVoucher.is_voucher_new_user && (
            <input
              type="text"
              name="user_id"
              placeholder="User ID (If new user only)"
              value={newVoucher.user_id}
              onChange={handleAddChange}
              style={styles.input}
            />
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
            <input
              type="text"
              name="user_id"
              placeholder="User ID (If new user only)"
              value={editVoucher.user_id}
              onChange={handleEditChange}
              style={styles.input}
            />
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
    </div>
  );
}

const styles = {
  container: {
    width: "80%",
    margin: "0 auto",
    paddingTop: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thTd: {
    padding: "10px",
    textAlign: "center",
    border: "1px solid #ddd",
  },
  th: {
    backgroundColor: "#f4f4f4",
  },
  imageStyle: {
    width: "50px",
    height: "50px",
  },
  description: {
    maxWidth: "200px",
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
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 10,
  },
  modalHeader: {
    marginBottom: "20px",
    fontSize: "24px",
  },
  input: {
    width: "100%",
    padding: "4px",
    marginBottom: "10px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    minHeight: "80px",
  },
  timeInputContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  checkbox: {
    marginLeft: "10px",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    marginLeft:"40px"
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 40px",
    border: "none",
    cursor: "pointer",
    marginLeft:"20px"
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
  },
};
