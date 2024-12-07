import React, { useState, useEffect } from "react";
import axios from "axios";

const AddBrandModal = ({ isOpen, onClose, onAddBrand, currentBrand }) => {
  const [name_brand, setName_brand] = useState("");
  const [image_brand, setImage_brand] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // URL preview ảnh
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentBrand) {
      setName_brand(currentBrand.name_brand || "");
      setImagePreview(currentBrand.image || null); // Hiển thị ảnh hiện tại nếu có
    } else {
      setName_brand("");
      setImagePreview(null);
    }
    setImage_brand(null); // Xóa ảnh file cũ khi mở modal
  }, [currentBrand, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage_brand(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Hiển thị ảnh mới được chọn
    }
  };

  const handleAddBrand = async () => {
    if (!name_brand || (!image_brand && !currentBrand)) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name_brand", name_brand);
    if (image_brand) {
      formData.append("image", image_brand);
    }

    try {
      const response = await axios.post(
        "https://backenddatn-production.up.railway.app/v1/api/brand/add_brand",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onAddBrand(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding brand:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <h2>{currentBrand ? "Edit Brand" : "Add New Brand"}</h2>
          <input
            type="text"
            placeholder="Brand Name"
            value={name_brand}
            onChange={(e) => setName_brand(e.target.value)}
            style={styles.input}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Brand Preview"
              style={styles.imagePreview}
            />
          )}
          <div style={styles.buttonContainer}>
            <button
              onClick={handleAddBrand}
              style={styles.addButton}
              disabled={loading}
            >
              {loading ? "Processing..." : currentBrand ? "Update Brand" : "Add Brand"}
            </button>
            <button onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
          {loading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.loader}></div>
            </div>
          )}
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
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  imagePreview: {
    width: "100%",
    height: "auto",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loader: {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #28a745",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 2s linear infinite",
  },
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default AddBrandModal;
