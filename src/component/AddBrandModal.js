import React, { useState } from "react";
import axios from "axios";

const AddBrandModal = ({ isOpen, onClose, onAddBrand }) => {
  const [name_brand, setName_brand] = useState("");
  const [image_brand, setImage_brand] = useState(null);

  const handleAddBrand = async () => {
    if (!name_brand || !image_brand) {
      alert("Please provide both brand name and image");
      return;
    }

    const formData = new FormData();
    formData.append("name_brand", name_brand);
    formData.append("image", image_brand);  // Đổi tên trường từ 'image_brand' thành 'image'

    try {
      const response = await axios.post(
        "http://localhost:5000/v1/api/brand/add_brand",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onAddBrand(response.data); // Cập nhật danh sách brand sau khi thêm mới
      alert("Brand added successfully");
      onClose(); // Đóng modal sau khi thêm thành công
    } catch (error) {
        console.error("Error adding brand:", error.response?.data || error.message);
        alert("Failed to add brand");
    }
  };

  return (
    isOpen && (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <h2>Add New Brand</h2>
          <input
            type="text"
            placeholder="Brand Name"
            value={name_brand}
            onChange={(e) => setName_brand(e.target.value)}
            style={styles.input}
          />
          <input
            type="file"
            onChange={(e) => setImage_brand(e.target.files[0])}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handleAddBrand} style={styles.addButton}>
              Add Brand
            </button>
            <button onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AddBrandModal;
