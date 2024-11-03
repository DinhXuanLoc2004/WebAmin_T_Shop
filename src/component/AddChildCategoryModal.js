import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

export default function AddChildCategoryModal({ isOpen, onRequestClose, selectedCategory, selectedSubCategory, onChildCategoryAdded }) {
  const [childCategoryName, setChildCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleAddChildCategory = async () => {
    if (!selectedCategory || !selectedSubCategory) {
      setError("Vui lòng chọn cả danh mục đời 1 và đời 2 trước khi thêm danh mục con.");
      return;
    }

    if (!childCategoryName.trim()) {
      setError("Tên danh mục con không được để trống.");
      return;
    }

    const formData = new FormData();
    formData.append("name_category", childCategoryName);
    formData.append("parent_id", selectedSubCategory._id);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await axios.post("http://192.168.1.51:5000/v1/api/category/add_category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        onChildCategoryAdded(response.data.metadata.category);
        setChildCategoryName("");
        setImageFile(null);
        setError("");
        alert("Add Success!");
        onRequestClose();
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục con:", error);
      setError("Đã xảy ra lỗi khi thêm danh mục con.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    } else {
      setError("Lỗi khi tải ảnh, vui lòng thử lại.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm Danh Mục Con"
      style={modalStyles}
    >
      <h2 style={styles.header}>Thêm Danh Mục Con</h2>
      <input
        type="text"
        placeholder="Tên danh mục con"
        value={childCategoryName}
        onChange={(e) => setChildCategoryName(e.target.value)}
        style={styles.input}
      />
      <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      {imageFile && <p style={styles.fileName}>Ảnh đã chọn: {imageFile.name}</p>}
      <button onClick={handleAddChildCategory} style={styles.addButton}>
        Thêm
      </button>
      {error && <p style={styles.errorText}>{error}</p>}
      <button onClick={onRequestClose} style={styles.closeButton}>
        Đóng
      </button>
    </Modal>
  );
}

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
