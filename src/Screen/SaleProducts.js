import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../helper/axiosIntercreptor";

const SalesActive = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailSale, setDetailSale] = useState(null);
  const [salesActive, setSalesActive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSale, setNewSale] = useState({
    discount: "",
    time_start: "",
    time_end: "",
    product_ids: "",
    name_sale: "",
    image: { file: null, url: "" },
  });
  const [editsale, setEditsale] = useState({
    discount: "",
    time_start: "",
    time_end: "",
    product_ids: "",
    name_sale: "",
    image: { file: null, url: "" },
  });
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSaleId, setEditSaleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSales = async () => {
    try {
      const responseActive = await axios.get(
        "http://localhost:5000/v1/api/sale/get_sales_active"
      );
      setSalesActive(responseActive.data.metadata);
      setLoading(false);
    } catch (err) {
      setError("Error fetching data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditMode) {
      setEditsale((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewSale((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageData = {
        file: file,
        url: URL.createObjectURL(file),
      };
      if (isEditMode) {
        setEditsale((prevState) => ({
          ...prevState,
          image: imageData,
        }));
      } else {
        setNewSale((prevState) => ({
          ...prevState,
          image: imageData,
        }));
      }
    }
  };

  const handleAddSale = async () => {
    try {
      if (
        !newSale.discount ||
        !newSale.time_start ||
        !newSale.time_end ||
        !newSale.name_sale ||
        !newSale.product_ids
      ) {
        setMessage("All fields are required. Please check the form.");
        alert("All fields are required. Please check the form.");
        return;
      }

      let productIdsArray = [];
      try {
        productIdsArray = JSON.parse(newSale.product_ids);

        if (!Array.isArray(productIdsArray)) {
          setMessage(
            'Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).'
          );
          alert(
            'Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).'
          );
          return;
        }
      } catch (e) {
        setMessage(
          'Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).'
        );
        alert(
          'Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).'
        );
        return;
      }

      if (productIdsArray.length === 0) {
        setMessage("Product IDs cannot be empty.");
        alert("Product IDs cannot be empty.");
        return;
      }

      if (newSale.image.file && !newSale.image.file.type.startsWith("image")) {
        setMessage("Please upload a valid image.");
        alert("Please upload a valid image.");
        return;
      }

      const formData = new FormData();
      formData.append("discount", newSale.discount);
      formData.append("time_start", newSale.time_start);
      formData.append("time_end", newSale.time_end);
      formData.append("product_ids", JSON.stringify(productIdsArray));
      formData.append("name_sale", newSale.name_sale);

      if (newSale.image.file) {
        formData.append("image", newSale.image.file);
      }

      const url = "http://localhost:5000/v1/api/sale/add_sale"; // API add_sale

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Operation Success");
        fetchSales();
        setShowAddModal(false);
      } else {
        alert(response.data.message || "An error occurred. Please try again.");
        setShowAddModal(false);
      }
    } catch (err) {
      alert(
        "Error creating or updating sale. Please check the form and try again."
      );
      console.error(err.response ? err.response.data : err);
      setShowAddModal(false);
    }
  };

  const handleEditSale = async () => {
    try {
      if (
        !editsale.discount ||
        !editsale.time_start ||
        !editsale.time_end ||
        !editsale.name_sale ||
        !editsale.product_ids
      ) {
        setMessage("All fields are required. Please check the form.");
        alert("All fields are required. Please check the form.");
        return;
      }

      let productIdsArray = [];
      try {
        productIdsArray = JSON.parse(editsale.product_ids);
      } catch (e) {
        setMessage(
          'Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).'
        );
        alert(
          'Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).'
        );
        return;
      }

      if (productIdsArray.length === 0) {
        setMessage("Product IDs cannot be empty.");
        alert("Product IDs cannot be empty.");
        return;
      }

      if (
        editsale.image.file &&
        !editsale.image.file.type.startsWith("image")
      ) {
        setMessage("Please upload a valid image.");
        alert("Please upload a valid image.");
        return;
      }

      const formData = new FormData();
      formData.append("discount", editsale.discount);
      formData.append("time_start", editsale.time_start);
      formData.append("time_end", editsale.time_end);
      formData.append("product_ids", JSON.stringify(productIdsArray));
      formData.append("name_sale", editsale.name_sale);

      if (editsale.image.file) {
        formData.append("image", editsale.image.file);
      } else if (editsale.image.url) {
        formData.append("image_url", editsale.image.url);
      }

      const url = `http://localhost:5000/v1/api/sale/update_sale?_id=${editSaleId}`;

      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        fetchSales();
        setShowEditModal(false);
        alert("edit sale Success");
      } else {
        alert(response.data.message || "An error occurred. Please try again.");
        setShowEditModal(false);
      }
    } catch (err) {
      alert(
        "Error creating or updating sale. Please check the form and try again."
      );
      console.error(err.response ? err.response.data : err);
      setShowEditModal(false);
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setShowEditModal(false);

    setShowDetailModal(false);
  };

  const handleEditSaleDetails = (sale) => {
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().slice(0, 16); 
    };

    setEditsale({
      discount: sale.discount,
      time_start: formatDate(sale.time_start),
      time_end: formatDate(sale.time_end),
      product_ids: "",
      name_sale: sale.name_sale,
      image: { file: null, url: sale.thumb || "" }, 
    });
    setEditSaleId(sale._id);
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const filteredSales = salesActive
    .filter((sale) => sale.is_active) 
    .filter((sale) =>
      sale.name_sale.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const handleToggleSaleStatus = async (saleId) => {
    try {
      const response = await axiosInstance.put(
        `sale/change_is_active_sale?_id=${saleId}`
      );
      alert("Delete sale successfully");
      fetchSales();
    } catch (error) {
      console.error(error);
      alert("Error occurred while deleting the sale. Please try again.");
    }
  };

  const handleViewSaleDetail = async (saleId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/v1/api/sale/get_sale_update_detail?sale_id=${saleId}`
      );
      if (response.data && response.data.metadata) {
        console.log("Sale Detail:", response.data.metadata); 
        setDetailSale(response.data.metadata); 
        setShowDetailModal(true); 
      } else {
        alert("No sale details found.");
      }
    } catch (err) {
      console.error("Error fetching sale details:", err);
      alert("Failed to fetch sale details. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by Sale Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.input}
      />
      <button
        onClick={() => {
          setIsEditMode(false);
          setShowAddModal(true);
        }}
        style={styles.addSaleButton}
      >
        Add New Sale
      </button>

      {showAddModal && (
        <div
          style={{
            ...styles.modal,
            ...(showAddModal && styles.modalVisible),
          }}
        >
          <div style={styles.modalContent}>
            <h2>Add New Sale</h2>
            <div>
              <label>Name Sale:</label>
              <input
                type="text"
                name="name_sale"
                value={newSale.name_sale}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Discount (%):</label>
              <input
                type="number"
                name="discount"
                value={newSale.discount}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Time Start:</label>
              <input
                type="datetime-local"
                name="time_start"
                value={newSale.time_start}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Time End:</label>
              <input
                type="datetime-local"
                name="time_end"
                value={newSale.time_end}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Product IDs (JSON format):</label>
              <textarea
                name="product_ids"
                value={newSale.product_ids}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Image (Upload):</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={styles.input}
              />
            </div>
            {newSale.image.url && (
              <div>
                <h4>Selected Image:</h4>
                <img
                  src={newSale.image.url}
                  alt="Selected"
                  style={styles.selectedImage}
                />
              </div>
            )}
            <div>
              <button onClick={handleAddSale} style={styles.button}>
                Add Sale
              </button>
              <button onClick={handleCancel} style={styles.buttonCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h2 style={styles.modalTitle}>Sale Details</h2>
            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Sale Name:</h4>
                <p style={styles.detailValue}>{detailSale.name_sale}</p>
              </div>
            </div>
            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Discount:</h4>
                <p style={styles.detailValue}>{detailSale.discount}%</p>
              </div>
            </div>
            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Start Date:</h4>
                <p style={styles.detailValue}>
                  {new Date(detailSale.time_start).toLocaleString()}
                </p>
              </div>
            </div>
            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>End Date:</h4>
                <p style={styles.detailValue}>
                  {new Date(detailSale.time_end).toLocaleString()}
                </p>
              </div>
            </div>
            <div style={styles.detailSection}>
              <div style={styles.detailRow}>
                <h4 style={styles.detailLabel}>Image:</h4>
                <img
                  src={detailSale.image_sale.url}
                  alt={detailSale.name_sale}
                  style={styles.saleImage}
                />
              </div>
            </div>
            <div style={styles.productList}>
              <h3 style={styles.productListTitle}>Products in Sale:</h3>
              <ul style={styles.productListItems}>
                {detailSale.products.map((product) => (
                  <li key={product.product_id} style={styles.productItem}>
                    <p style={styles.productText}>
                      <strong>Product Name:</strong> {product.name_product}
                    </p>
                    <p style={styles.productText}>
                      <strong>Category:</strong> {product.name_category}
                    </p>
                    <p style={styles.productText}>
                      <strong>Brand:</strong> {product.name_brand}
                    </p>
                    <img
                      src={product.thumb}
                      alt={product.name_product}
                      style={styles.productImage}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          style={{
            ...styles.modal,
            ...(showEditModal && styles.modalVisible),
          }}
        >
          <div style={styles.modalContent}>
            <h2>Edit Sale</h2>
            <div>
              <label>Name Sale:</label>
              <input
                type="text"
                name="name_sale"
                value={editsale.name_sale}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Discount (%):</label>
              <input
                type="number"
                name="discount"
                value={editsale.discount}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Time Start:</label>
              <input
                type="datetime-local"
                name="time_start"
                value={editsale.time_start}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Time End:</label>
              <input
                type="datetime-local"
                name="time_end"
                value={editsale.time_end}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Product IDs (JSON format):</label>
              <textarea
                name="product_ids"
                value={editsale.product_ids}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div>
              <label>Image (Upload):</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={styles.input}
              />
            </div>
            {editsale.image.url && (
              <div>
                <h4>Selected Image:</h4>
                <img
                  src={editsale.image.url || "https://via.placeholder.com/150"}
                  alt="Selected"
                  style={styles.selectedImage}
                />
              </div>
            )}
            <div>
              <button onClick={handleEditSale} style={styles.button}>
                Update Sale
              </button>
              <button onClick={handleCancel} style={styles.buttonCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredSales.length === 0 ? (
        <p>No active sales at the moment.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>STT</th>
              <th style={styles.tableCell}>Image</th>
              <th style={styles.tableCell}>Sale Name</th>
              <th style={styles.tableCell}>Discount</th>
              <th style={styles.tableCell}>MFG Date</th>
              <th style={styles.tableCell}>EXP Date</th>
              <th style={styles.tableCell}>Active</th>
              <th style={styles.tableCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale, index) => (
              <tr
                key={sale._id}
                style={index % 2 === 0 ? styles.tableRowEven : styles.tableRow}
              >
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>
                  <img
                    src={sale.thumb || "https://via.placeholder.com/150"}
                    alt={sale.name_sale}
                    style={styles.thumbnail}
                   
                  />
                </td>
                <td style={styles.tableCell}>{sale.name_sale}</td>
                <td style={styles.tableCell}>{sale.discount}%</td>
                <td style={styles.tableCell}>
                  {new Date(sale.time_start).toLocaleDateString()}
                </td>
                <td style={styles.tableCell}>
                  {new Date(sale.time_end).toLocaleDateString()}
                </td>
                <td style={styles.tableCell}>
                  {sale.is_active ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => handleEditSaleDetails(sale)}
                    style={styles.button}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.buttonCancel}
                    onClick={() => handleToggleSaleStatus(sale._id)}
                  >
                    Delete
                  </button>

                  <button
                    style={styles.buttonDetail}
                    onClick={() => handleViewSaleDetail(sale._id)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 0.3s ease",
  },
  modalVisible: {
    opacity: 1,
    visibility: "visible",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  buttonCancel: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonDetail: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft:"10px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },
  tableRow: {
    backgroundColor: "white",
  },
  tableRowEven: {
    backgroundColor: "white",
  },
  thumbnail: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
  },
  selectedImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    marginTop: "10px",
  },
  addSaleButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 18px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },

  close: {
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  },

  modalTitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  closeButton: {
    background: "red",
    border: "none",
    fontSize: "30px",
    fontWeight: "bold",
    color: "#999",
    cursor: "pointer",
  },
  detailSection: {
    marginBottom: "15px",
  },
  detailLabel: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#555",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between", // Căn giữa tên và giá trị
    alignItems: "center",
  },
  detailValue: {
    fontSize: "16px",
    color: "#333",
    marginTop: "5px",
  },
  saleImage: {
    maxWidth: "400px",
    maxHeight: "100px",
    objectFit: "cover",
    borderRadius: "4px",
    marginTop: "10px",
  },
  productList: {
    marginTop: "20px",
  },
  productListTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "15px",
  },
  productListItems: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  productItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    marginBottom: "10px",
    padding: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  productText: {
    fontSize: "14px",
    color: "#555",
    margin: "5px 0",
  },
  productImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    marginTop: "10px",
    borderRadius: "4px",
  },
};

export default SalesActive;
