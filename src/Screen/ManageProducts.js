import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronLeft,
  faChevronRight,
  faStar,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import "../Css/Dialog.css";
import "../Css/Spinner.css";
import axios from "axios";
import ColorAndSize from "../component/ColorAndSize";
import DeleteDialog from "../component/DeleteDialog";
import AddProduct from "../component/AddProduct";
import EditProduct from "../component/EditProduct";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? selectedProduct.images_product.length - 1
        : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === selectedProduct.images_product.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const fetchProducts = async () => {
    try {
      const result = await axios.post(
        `http://localhost:5000/v1/api/product/get_all_products?is_delete=${false}`
      );
      setProducts(result.data.metadata.products);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => {
      setProducts([]);
    };
  }, []);

  const handleProductClick = async (productId) => {
    if (!productId) return;
    try {
      const result = await axios.get(
        `http://localhost:5000/v1/api/product/get_detail_product?product_id=${productId}`
      );
      setSelectedProduct(result.data.metadata);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/v1/api/product/toggle_delete_product?_id=${productId}`
      );
      fetchProducts();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteButtonClick = (productId, event) => {
    event.stopPropagation();
    setProductIdToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const filteredItems = products.filter((product) =>
    product.name_product.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div style={styles.container(isDeleteDialogOpen)}>
      <ColorAndSize />

      <input
        type="text"
        placeholder="Search by name product"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInput}
      />

      <AddProduct onProductAdded={fetchProducts} />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => handleDeleteProduct(productIdToDelete)}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thTd}>STT</th>
            <th style={styles.thTd}>Image</th>
            <th style={styles.thTd}>Products</th>
            <th style={styles.thTd}>Brand</th>
            <th style={styles.thTd}>Category</th>
            <th style={styles.thTd}>Rate</th>
            <th style={styles.thTd}>Quantity</th>
            <th style={styles.thTd}>Price</th>
            <th style={styles.thTd}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((product, index) => (
            <tr key={index} style={{ cursor: "pointer" }}>
              <td style={styles.thTdTable}>{index + 1}</td>
              <td style={styles.thTd}>
                <img
                  src={product.thumb}
                  alt="Product"
                  style={styles.img}
                  onClick={() => handleProductClick(product._id)} // Mở modal khi nhấn vào ảnh
                />
              </td>
              <td style={styles.thTdTable}>{product.name_product}</td>
              <td style={styles.thTdTable}>{product.name_brand}</td>
              <td style={styles.thTdTable}>{product.name_category}</td>
              <td style={styles.thTdTable}>
                <span>{product.rate}</span>
                <span style={{ color: "yellow", fontSize: 24, marginLeft: 10 }}>
                  ★
                </span>
                <span style={{ color: "gray", marginLeft: 10 }}>
                  ({product.averageRating})
                </span>
              </td>
              <td style={styles.thTdTable}>{product.inventory_quantity}</td>
              <td style={styles.thTdTable}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price_min)}
              </td>

              <td style={styles.thTd}>
                <EditProduct
                  productId={product._id}
                  onProductUpdated={fetchProducts}
                />
                <button
                  style={styles.deleteBtn}
                  onClick={(e) => handleDeleteButtonClick(product._id, e)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog chi tiết sản phẩm */}
      {isDialogOpen && selectedProduct && (
        <Modal
          show={isDialogOpen}
          onHide={handleCloseDialog}
          centered
          dialogClassName="custom-modal"
        >
          <Modal.Body style={styles.modalBody}>
            <div style={styles.galleryContainer}>
              <div>
                {selectedProduct && selectedProduct.images_product && (
                  <img
                    src={selectedProduct.images_product[currentIndex].url}
                    alt="Main"
                    style={styles.mainImage}
                  />
                )}
              </div>

              <div style={styles.arrowThumbnailContainer}>
                <button onClick={handlePrevClick} style={styles.arrowButton}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div style={styles.thumbnailContainer}>
                  {selectedProduct.images_product.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      style={{
                        ...styles.thumbnail,
                        borderWidth: currentIndex === index ? "3px" : "1px",
                        borderColor:
                          currentIndex === index ? "#DB3022" : "#ccc",
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index}`}
                        style={styles.thumbnailImage}
                      />
                    </div>
                  ))}
                </div>

                <button onClick={handleNextClick} style={styles.arrowButton}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>

            <div style={styles.productInfo}>
              <div>
                <h1>{selectedProduct.name_product}</h1>
                <div style={styles.priceRateContainer}>
                  <div style={styles.priceContainer}>
                    <h4 style={{ fontWeight: "bold" }}>
                      ${selectedProduct.price}
                    </h4>
                    <h6>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "gray",
                        }}
                      >
                        ${selectedProduct.price}
                      </span>
                    </h6>
                  </div>
                  <div style={styles.rateReviewsContainer}>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          color: "orange",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          style={{ marginRight: "5px" }}
                        />
                        {selectedProduct.averageRating}
                      </span>
                      <span
                        style={{
                          color: "#b1b1b1",
                          marginLeft: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faComment}
                          style={{ marginRight: "5px" }}
                        />
                        {selectedProduct.countReview} Reviews
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <p>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Colors:
                </div>
                {selectedProduct.colors.map((color, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: color.hex_color,
                      ...styles.colorCircle,
                    }}
                  ></span>
                ))}
              </p>
              <p>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Sizes:
                </div>
                {selectedProduct.sizes.map((size, idx) => (
                  <button key={idx} style={styles.sizeButton}>
                    {size.size}
                  </button>
                ))}
              </p>
              <p
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <strong>
                  Brand:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {selectedProduct.name_brand}
                  </span>
                </strong>{" "}
                <strong>
                  Category:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {selectedProduct.name_category}
                  </span>
                </strong>
              </p>
              <p>
                <strong>Description:</strong>
                <div>{selectedProduct.description}</div>
              </p>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

const styles = {
  galleryContainer: {
    textAlign: "center",
  },
  mainImage: {
    marginTop: "10px",
    width: "60%",
    height: "300px",
  },
  arrowThumbnailContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "10px",
  },
  arrowButton: {
    background: "none",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
  thumbnailContainer: {
    display: "flex",
    gap: "25px",
  },
  thumbnail: {
    width: "80px",
    height: "80px",
    border: "1px solid #ccc",
    // padding: "5px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "border-color 0.3s ease",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "5px",
  },
  container: (isBlurred) => ({
    padding: "20px",
    filter: isBlurred ? "blur(5px)" : "none",
    pointerEvents: isBlurred ? "none" : "auto", // Ngăn tương tác khi mờ
    transition: "filter 0.3s ease", // Hiệu ứng chuyển đổi mượt
  }),
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "60px",
  },
  thTd: {
    textAlign: "center",
    padding: 15,
    fontWeight: "normal",
    borderBottom: "1px solid #ddd",
  },
  thTdTable: {
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  img: {
    width: "40px",
    height: "40px",
  },
  sliderItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  colorCircle: {
    display: "inline-block",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    verticalAlign: "middle",
  },
  sizeButton: {
    marginRight: "10px",
    width: "30px",
    height: "30px",
    background: "#ffffff",
    border: "1px solid #000",
    cursor: "pointer",
    borderRadius: "10px",
  },
  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  editBtn: {
    marginRight: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  modalBody: {
    display: "flex",
  },
  priceRateContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "300px",
  },
  addBtn: {
    position: "absolute",
    right: "80px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
  },
  modalBody1: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    height: "100px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
  },
  buttonCancel: {
    backgroundColor: "#6c757d",
  },
  buttonAddVariant: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "8px 16px",
    marginTop: "10px",
    border: "none",
    borderRadius: "5px",
  },
  inputFile: {
    padding: "5px",
  },
  variantContainer: {
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    borderBottom: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f8f9fa",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  modalFooter: {
    padding: "15px",
    textAlign: "right",
  },
  searchInput: {
    padding: "8px 8px 8px 30px",
    width: "45%",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    marginTop: "10px",
  },
};
