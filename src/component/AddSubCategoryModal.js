import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root"); // Đảm bảo app có root để modal hoạt động

export default function AddSubCategoryModal({ isOpen, onRequestClose, selectedCategory, onSubCategoryAdded }) {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state cho loading

  // Hàm xử lý thêm danh mục đời 2
  const handleAddSubCategory = async () => {
    if (!selectedCategory) {
      setError("Vui lòng chọn danh mục đời 1 trước khi thêm danh mục đời 2.");
      return;
    }

    if (!subCategoryName.trim()) {
      setError("Tên danh mục đời 2 không được để trống.");
      return;
    }

    // Tạo form data để gửi ảnh
    const formData = new FormData();
    formData.append("name_category", subCategoryName);
    formData.append("parent_id", selectedCategory._id);
    if (imageFile) formData.append("image", imageFile);

    setLoading(true); // Bắt đầu quá trình tải

    try {
      const response = await axios.post("https://backenddatn-production.up.railway.app/v1/api/category/add_category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        onRequestClose(); // Đóng modal sau khi thêm thành công
        setSubCategoryName("");
        setImageFile(null);
        setError("");
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục đời 2:", error);
      setError("Đã xảy ra lỗi khi thêm danh mục đời 2.");
    } finally {
      setLoading(false); // Dừng quá trình tải sau khi hoàn thành
    }
  };

  // Hàm xử lý chọn file
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm danh mục đời 2"
      style={modalStyles}
    >
      <h2 style={styles.header}>Thêm Danh Mục Đời 2</h2>

      {/* Input tên danh mục đời 2 */}
      <input
        type="text"
        placeholder="Tên danh mục đời 2"
        value={subCategoryName}
        onChange={(e) => setSubCategoryName(e.target.value)}
        style={styles.input}
      />

      {/* Input chọn ảnh */}
      <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      {imageFile && <p style={styles.fileName}>Ảnh đã chọn: {imageFile.name}</p>}

      {/* Overlay loading */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loader}></div>
        </div>
      )}

      {/* Nút Thêm */}
      <button onClick={handleAddSubCategory} style={styles.addButton} disabled={loading}>
        {loading ? "Đang tải..." : "Thêm"}
      </button>

      {error && <p style={styles.errorText}>{error}</p>}

      {/* Nút Đóng */}
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
// Thêm keyframe cho hiệu ứng xoay
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    borderRadius: "12px",
  },
  loader: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #00a8ff",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
};
