import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Vouchers() {
  const [searchItem, setSearchItem] = useState("");
  const [voucher, setVoucher] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    voucher_name: "",
    voucher_description: "",
    voucher_type: "percent",
    voucher_value: 0,
    voucher_code: "",
    image: null,
    time_start: "",
    time_end: "",
    quantity: 0,
    min_order_value: 0,
    is_active: true,
    is_voucher_new_user: false,
  });
  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/api/voucher/get_voucher"
      );
      setVoucher(response.data.metadata); // Cập nhật lại state với dữ liệu mới
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };
  
  // Fetch vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/v1/api/voucher/get_voucher"
        );
        setVoucher(response.data.metadata);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVoucher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewVoucher((prev) => ({ ...prev, image: file }));
  };

  // Submit new voucher
  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(newVoucher).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post(
        "http://localhost:5000/v1/api/voucher/create_voucher",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Voucher added successfully!");
      setShowModal(false);
      setNewVoucher({
        voucher_name: "",
        voucher_description: "",
        voucher_type: "percent",
        voucher_value: 0,
        voucher_code: "",
        image: null,
        time_start: "",
        time_end: "",
        quantity: 0,
        min_order_value: 0,
        is_active: true,
        is_voucher_new_user: false,
      });
      fetchVouchers()
    } catch (error) {
      console.error("Error creating voucher:", error);
      alert("Failed to add voucher.");
    }
  };

  const filteredItems = voucher.filter((voucher) =>
    voucher.voucher_code.toLowerCase().includes(searchItem.toLowerCase())
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
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher name</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher type</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher value</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher code</th>
            <th style={{ ...styles.thTd, ...styles.th }}>MFG Date</th>
            <th style={{ ...styles.thTd, ...styles.th }}>EXP Date</th>
            <th style={{ ...styles.thTd, ...styles.th }}>
              Voucher description
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((voucher, index) => (
            <tr key={voucher._id}>
              <td style={styles.thTd}>{index + 1}</td>
              <td style={styles.thTd}>{voucher.voucher_name}</td>
              <td style={styles.thTd}>{voucher.voucher_type}</td>
              <td style={styles.thTd}>{voucher.voucher_value}</td>
              <td style={styles.thTd}>{voucher.voucher_code}</td>
              <td style={styles.thTd}>
                {new Date(voucher.time_start).toLocaleDateString()}
              </td>
              <td style={styles.thTd}>
                {new Date(voucher.time_end).toLocaleDateString()}
              </td>
              <td style={{...styles.thTd,whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{voucher.voucher_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.addButton} onClick={() => setShowModal(true)}>
        +
      </div>

      {showModal && (
  <div style={styles.modal}>
    <h2 style={styles.modalHeader}>Add Voucher</h2>
    <input
      type="text"
      name="voucher_name"
      placeholder="Voucher Name"
      value={newVoucher.voucher_name}
      onChange={handleChange}
      style={styles.input}
    />
    <textarea
      name="voucher_description"
      placeholder="Description"
      value={newVoucher.voucher_description}
      onChange={handleChange}
      style={styles.textarea}
    />
    <select
      name="voucher_type"
      value={newVoucher.voucher_type}
      onChange={handleChange}
      style={styles.select}
    >
      <option value="percent">Percent</option>
      <option value="deduct_money">Deduct Money</option>
      <option value="complete_coin">Complete Coin</option>
    </select>
    <input
      type="number"
      name="voucher_value"
      placeholder="Value"
      value={newVoucher.voucher_value}
      onChange={handleChange}
      style={styles.input}
    />
    <input
      type="text"
      name="voucher_code"
      placeholder="Code"
      value={newVoucher.voucher_code}
      onChange={handleChange}
      style={styles.input}
    />
    <input
      type="file"
      name="image"
      onChange={handleImageUpload}
      style={styles.input}
    />
    <input
      type="datetime-local"
      name="time_start"
      value={newVoucher.time_start}
      onChange={handleChange}
      style={styles.input}
    />
    <input
      type="datetime-local"
      name="time_end"
      value={newVoucher.time_end}
      onChange={handleChange}
      style={styles.input}
    />
    <input
      type="number"
      name="quantity"
      placeholder="Quantity"
      value={newVoucher.quantity}
      onChange={handleChange}
      style={styles.input}
    />
    <input
      type="number"
      name="min_order_value"
      placeholder="Min Order Value"
      value={newVoucher.min_order_value}
      onChange={handleChange}
      style={styles.input}
    />
    <div style={styles.buttonContainer}>
      <button style={styles.saveButton} onClick={handleSubmit}>
        Save
      </button>
      <button style={styles.cancelButton} onClick={() => setShowModal(false)}>
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  thTd: { padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" },
  th: { backgroundColor: "#f5f5f5" },
  searchInPut: {
    padding: "8px",
    width: "45%",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    marginBottom: "30px",
  },
  addButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "24px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    width: "500px",
  },
  modalHeader: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    minHeight: "80px",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },

};
