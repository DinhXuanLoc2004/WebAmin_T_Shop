import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

export default function AddMainCategoryModal({ isOpen, onRequestClose, onMainCategoryAdded }) {
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleAddMainCategory = async () => {
    if (!mainCategoryName.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    const formData = new FormData();
    formData.append("name_category", mainCategoryName);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await axios.post("http://192.168.1.51:5000/v1/api/category/add_category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        onMainCategoryAdded(response.data.metadata.category);
        setMainCategoryName("");
        setImageFile(null);
        setError("");
        alert("Add Success!");
        onRequestClose();
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục chính:", error);
      setError("Đã xảy ra lỗi khi thêm danh mục chính.");
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm Danh Mục Chính"
      style={modalStyles}
    >
      <h2 style={styles.header}>Thêm Danh Mục Chính</h2>
      <input
        type="text"
        placeholder="Tên danh mục chính"
        value={mainCategoryName}
        onChange={(e) => setMainCategoryName(e.target.value)}
        style={styles.input}
      />
      <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      {imageFile && <p style={styles.fileName}>Ảnh đã chọn: {imageFile.name}</p>}
      <button onClick={handleAddMainCategory} style={styles.addButton}>
        Thêm
      </button>
      {error && <p style={styles.errorText}>{error}</p>}
      <button onClick={onRequestClose} style={styles.closeButton}>
        Đóng
      </button>
    </Modal>
  );
}

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
};

const styles = {
  header: {
    textAlign: "center",
    color: "#333",
    fontSize: "20px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    marginBottom: "15px",
  },
  fileInput: {
    display: "block",
    marginBottom: "10px",
  },
  fileName: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  addButton: {
    padding: "10px 15px",
    backgroundColor: "#00a8ff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  },
  closeButton: {
    padding: "8px 12px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
    fontSize: "16px",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
    textAlign: "center",
  },
};
