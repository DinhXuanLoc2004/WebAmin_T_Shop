import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import DeleteDialog from "./DeleteDialog";

Modal.setAppElement("#root");

export default function ProductOptions() {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isAddSizeModalOpen, setIsAddSizeModalOpen] = useState(false);
  const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [newHexColor, setNewHexColor] = useState("");
  const [newNameColor, setNewNameColor] = useState("");
  const [error, setError] = useState("");
  const [editingSizeId, setEditingSizeId] = useState(null);
  const [editingColorId, setEditingColorId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Tracks the target to delete
  const [deleteType, setDeleteType] = useState(null);

  useEffect(() => {
    fetchColors();
    fetchSizes();
  }, []);

  // API size
  const fetchSizes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/api/size/get_all_sizes"
      );
      setSizes(response.data.metadata);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleDeleteSize = async (sizeId) => {
    try {
      await axios.post(
        `http://localhost:5000/v1/api/size/delete_size?_id=${sizeId}`
      );
      setSizes(sizes.filter((size) => size._id !== sizeId));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting size:", error);
    }
  };

  const handleAddSize = async () => {
    if (!newSize.trim()) {
      setError("Size cannot be empty.");
      return;
    }
    setError("");

    try {
      await axios.post("http://localhost:5000/v1/api/size/add_size", {
        size: newSize,
      });
      fetchSizes();
      resetModal();
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Size already exists!"
      ) {
        setError("Size already exists!");
      } else {
        console.error("Error adding size:", error);
      }
    }
  };

  const handleUpdateSize = async () => {
    if (!newSize.trim()) {
      setError("Size cannot be empty.");
      return;
    }
    setError("");

    try {
      await axios.post(
        `http://localhost:5000/v1/api/size/update_size?_id=${editingSizeId}`,
        {
          size: newSize,
        }
      );
      fetchSizes();
      resetModal();
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Size already exists!"
      ) {
        setError("Size already exists!");
      } else {
        console.error("Error updating size:", error);
      }
    }
  };

  const openEditSizeModal = (sizeId, currentSize) => {
    setEditingSizeId(sizeId);
    setNewSize(currentSize);
    setIsAddSizeModalOpen(true);
  };

  // API color
  const fetchColors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/api/color/get_all_colors"
      );
      setColors(response.data.metadata);
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const handleDeleteColor = async (colorId) => {
    try {
      await axios.delete(
        `http://localhost:5000/v1/api/color/detele_color?_id=${colorId}`
      );
      fetchColors();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting color:", error);
    }
  };

  const handleAddColor = async () => {
    if (!newHexColor.trim() || !newNameColor.trim()) {
      setError("Both hex color and name color are required.");
      return;
    }
    setError("");

    try {
      await axios.post("http://localhost:5000/v1/api/color/add_color", {
        hex_color: newHexColor,
        name_color: newNameColor,
      });
      fetchColors();
      resetModal();
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (
          errorMessage === "Invalid hex color format. Expected format: #000000"
        ) {
          setError("Invalid hex color format. Expected format: #000000");
        } else if (
          errorMessage ===
          "Invalid name color format. Only letters are allowed."
        ) {
          setError("Invalid name color format. Only letters are allowed.");
        } else if (errorMessage === "Hex color already exists.") {
          setError("Hex color already exists!");
        } else {
          console.error("Error adding color:", error);
        }
      } else {
        console.error("Error adding color:", error);
      }
    }
  };

  const handleUpdateColor = async () => {
    if (!newHexColor.trim() || !newNameColor.trim()) {
      setError("Both hex color and name color are required.");
      return;
    }
    setError("");

    try {
      await axios.post(
        `http://localhost:5000/v1/api/color/update_color?_id=${editingColorId}`,
        {
          hex_color: newHexColor,
          name_color: newNameColor,
        }
      );
      fetchColors();
      resetModal();
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (
          errorMessage === "Invalid hex color format. Expected format: #000000"
        ) {
          setError("Invalid hex color format. Expected format: #000000");
        } else if (
          errorMessage ===
          "Invalid name color format. Only letters are allowed."
        ) {
          setError("Invalid name color format. Only letters are allowed.");
        } else if (errorMessage === "Hex color already exists.") {
          setError("Hex color already exists!");
        } else {
          console.error("Error updating color:", error);
        }
      } else {
        console.error("Error updating color:", error);
      }
    }
  };

  const openEditColorModal = (colorId, currentHexColor, currentNameColor) => {
    setEditingColorId(colorId);
    setNewHexColor(currentHexColor);
    setNewNameColor(currentNameColor);
    setIsAddColorModalOpen(true);
  };

  const resetModal = () => {
    setNewSize("");
    setNewHexColor("");
    setNewNameColor("");
    setEditingSizeId(null);
    setEditingColorId(null);
    setIsAddSizeModalOpen(false);
    setIsAddColorModalOpen(false);
  };

  const openDeleteDialog = (id, type) => {
    setDeleteTarget(id);
    setDeleteType(type);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === "size") {
      handleDeleteSize(deleteTarget);
    } else if (deleteType === "color") {
      handleDeleteColor(deleteTarget);
    }
    setIsDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
    setDeleteType(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div style={styles.selectionContainer}>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />

      <Modal
        isOpen={isAddColorModalOpen}
        onRequestClose={resetModal}
        style={modalStyles}
      >
        <h2 style={styles.modalTitle}>
          {editingColorId ? "Update Color" : "Add New Color"}
        </h2>
        <input
          type="text"
          value={newHexColor}
          onChange={(e) => setNewHexColor(e.target.value)}
          placeholder="Enter hex color"
          style={styles.modalInput}
        />
        <input
          type="text"
          value={newNameColor}
          onChange={(e) => setNewNameColor(e.target.value)}
          placeholder="Enter color name"
          style={styles.modalInput}
        />
        {error && <p style={styles.errorText}>{error}</p>}
        <div style={styles.modalButtonContainer}>
          <button
            style={{ ...styles.modalButton, background: "blue" }}
            onClick={editingColorId ? handleUpdateColor : handleAddColor}
          >
            <FontAwesomeIcon
              icon={editingColorId ? faEdit : faPlus}
              style={{ marginRight: "5px" }}
            />
            {editingColorId ? "Update Color" : "Add Color"}
          </button>
          <button
            style={{ ...styles.modalButton, background: "red" }}
            onClick={resetModal}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isAddSizeModalOpen}
        onRequestClose={resetModal}
        style={modalStyles}
      >
        <h2 style={styles.modalTitle}>
          {editingSizeId ? "Update Size" : "Add New Size"}
        </h2>
        <input
          type="text"
          value={newSize}
          onChange={(e) => {
            setNewSize(e.target.value);
            if (error) setError(""); 
          }}
          placeholder="Enter size"
          style={styles.modalInput}
        />
        {error && <p style={styles.errorText}>{error}</p>}
        <div style={styles.modalButtonContainer}>
          <button
            style={{ ...styles.modalButton, background: "blue" }}
            onClick={editingSizeId ? handleUpdateSize : handleAddSize}
          >
            <FontAwesomeIcon
              icon={editingSizeId ? faEdit : faPlus}
              style={{ marginRight: "5px" }}
            />
            {editingSizeId ? "Update Size" : "Add Size"}
          </button>
          <button
            style={{ ...styles.modalButton, background: "red" }}
            onClick={resetModal}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <div>
        <strong>Color:</strong>
        <div style={styles.colorOptions}>
          {colors.map((color) => (
            <div key={color._id} style={{ position: "relative" }}>
              <button
                style={{
                  backgroundColor: color.hex_color ?? color.name_color,
                  ...styles.colorCircle,
                }}
                onClick={() =>
                  openEditColorModal(
                    color._id,
                    color.hex_color,
                    color.name_color
                  )
                }
              ></button>
              <button
                style={styles.deleteButton}
                onClick={() => openDeleteDialog(color._id, "color")}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          <button
            style={styles.addColorButton}
            onClick={() => setIsAddColorModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      <div>
        <strong>Size:</strong>
        <div style={styles.sizeOptions}>
          {sizes.map((size) => (
            <div key={size._id} style={{ position: "relative" }}>
              <button
                style={styles.sizeButton}
                onClick={() => openEditSizeModal(size._id, size.size)}
              >
                {size.size}
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => openDeleteDialog(size._id, "size")}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
          <button
            style={styles.addSizeButton}
            onClick={() => setIsAddSizeModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  selectionContainer: {
    display: "flex",
    alignItems: "center",
    gap: "100px",
    marginBottom: "20px",
  },
  colorOptions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  colorCircle: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "1px solid #ccc",
  },
  addColorButton: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "1px solid #ccc",
  },
  sizeOptions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sizeButton: {
    width: "35px",
    height: "35px",
    border: "1px solid #000",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addSizeButton: {
    width: "35px",
    height: "35px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  deleteButton: {
    position: "absolute",
    top: "-9px",
    right: "-9px",
    background: "none",
    border: "none",
    color: "red",
    fontSize: "12px",
    cursor: "pointer",
  },
  modalTitle: {
    marginBottom: "10px",
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  modalButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: "10px",
    border: "none",
    color: "#ffffff",
    borderRadius: "4px",
    cursor: "pointer",
    width: "48%",
  },
  errorText: {
    color: "red",
    fontSize: "12px",
    textAlign: "center",
  },
};

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    borderRadius: "8px",
    padding: "20px",
  },
};
