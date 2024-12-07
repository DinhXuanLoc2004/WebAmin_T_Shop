import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBrandModal from "../component/AddBrandModal";
import DeleteDialog from "../component/DeleteDialog";

const ManageBrand = () => {
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // Trạng thái loading chỉ trong modal

  const handleDeleteClick = (id) => {
    setBrandToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteBrand = () => {
    handleDeleteBrand(brandToDelete);
    setIsDeleteDialogOpen(false);
  };

  const fetchBrands = (isDelete) => {
    // Chuyển isDelete thành query parameter
    const params =
      isDelete !== undefined ? { is_delete: isDelete.toString() } : {};

    axios
      .get("https://backenddatn-production.up.railway.app/v1/api/brand/get_all_brands", { params })
      .then((response) => {
        setBrands(response.data.metadata);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  };

  useEffect(() => {
    fetchBrands(false); // Giả sử bạn muốn lấy các brands chưa bị xóa
  }, []);

  useEffect(() => {
    fetchBrands(false);
  }, []);

  const handleAddBrand = (newBrand) => {
    fetchBrands();
  };

  const handleDeleteBrand = (id) => {
    axios
      .delete(
        `https://backenddatn-production.up.railway.app/v1/api/toggle_delete_brand?_id=${id}`
      )
      .then(() => {
        fetchBrands();
      })
      .catch((error) => {
        console.error("Error deleting brand:", error);
      });
  };

  const handleEditBrand = (updatedBrand) => {
    setLoading(true); // Bật trạng thái loading khi bắt đầu sửa
    const formData = new FormData();
    formData.append("name_brand", updatedBrand.name_brand);
    if (imageFile) formData.append("image", imageFile);

    axios
      .put(
        `https://backenddatn-production.up.railway.app/v1/api/brand/update_brand?_id=${updatedBrand._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        fetchBrands();
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating brand:", error);
      })
      .finally(() => {
        setLoading(false); // Tắt trạng thái loading khi hoàn thành
      });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div style={styles.container}>
      {brands &&
        brands.map((brand, index) => (
          <div key={index} style={styles.card}>
            {brand.image_brand?.url ? (
              <img
                src={brand.image_brand.url}
                alt={brand.name_brand}
                style={styles.image}
              />
            ) : (
              <p>No image available</p>
            )}
            <h3 style={styles.name}>{brand.name_brand}</h3>
            {/* <p style={styles.price}>{brand.productCount} products</p> */}
            <div style={styles.buttonContainer}>
              <button
                style={styles.editButton}
                onClick={() => {
                  setSelectedBrand(brand);
                  setIsEditModalOpen(true);
                }}
              >
                EDIT
              </button>

              {/* Kiểm tra trường can_be_delete trước khi hiển thị nút DELETE */}
              {brand.can_be_delete && (
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteClick(brand._id)}
                >
                  DELETE
                </button>
              )}
            </div>
          </div>
        ))}

      <div onClick={() => setIsModalOpen(true)} style={styles.addButton}>
        +
      </div>
      <AddBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBrand={handleAddBrand}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteBrand}
      />

      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Edit Brand</h2>
            <input
              type="text"
              placeholder="Brand Name"
              value={selectedBrand?.name_brand || ""}
              onChange={(e) =>
                setSelectedBrand({
                  ...selectedBrand,
                  name_brand: e.target.value,
                })
              }
              style={styles.input}
            />
            <input
              type="file"
              onChange={handleImageChange}
              style={styles.input}
            />
            {imageFile && (
              <div style={styles.previewContainer}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={styles.previewImage}
                />
              </div>
            )}
            <button
              onClick={() => handleEditBrand(selectedBrand)}
              style={styles.saveButton}
              disabled={loading} // Disable button khi đang loading
            >
              {loading ? "Updating..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
          {loading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.loader}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    padding: "20px",
    position: "relative",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: 250,
    height: 300,
    marginBottom: "10px",
  },
  name: {
    fontSize: "25px",
    margin: "10px 0",
  },
  price: {
    color: "#555",
    marginBottom: "10px",
    fontSize: "18px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  previewContainer: {
    marginTop: "10px",
    textAlign: "center",
  },
  previewImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
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

export default ManageBrand;
