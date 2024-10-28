import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faChevronLeft,
  faChevronRight,
  faStar,
  faComment
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import "../Css/Dialog.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([
    {
      id: "709 - 230",
      images: [
        "https://tse1.mm.bing.net/th?id=OIP.m-i6q-NXULLqpFFCZ8Pu9wHaEK&pid=Api&P=0&h=180",
        "https://tse4.mm.bing.net/th?id=OIP.2cVDwkg3RO8UZKUEWDKn8wHaFO&pid=Api&P=0&h=180",
        "https://tse1.mm.bing.net/th?id=OIP.94mqu1rmJ4ySGjzpHJAL8gHaEo&pid=Api&P=0&h=180",
      ],
      fullName: "Longsleeve Violeta",
      brand: "Uniqlo",
      category: "Active",
      rate: 4.5,
      reviews: 24,
      quantity: 10,
      price: 71.56,
      salePrice: 67.56,
      sold: 123,
      colors: ["#000000", "#9966FF", "#FF99FF", "#00FF38"],
      sizes: ["S", "M", "L", "XL"],
      description:
        "A comfortable and stylish longsleeve perfect for all seasons. Made with premium cotton for an excellent fit. A comfortable and stylish longsleeve perfect for all seasons. Made with premium cotton for an excellent fit.",
    },
    
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? selectedProduct.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === selectedProduct.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thTd}>ID User</th>
            <th style={styles.thTd}>Image</th>
            <th style={styles.thTd}>Products</th>
            <th style={styles.thTd}>Brand</th>
            <th style={styles.thTd}>Category</th>
            <th style={styles.thTd}>Rate</th>
            <th style={styles.thTd}>Quantity</th>
            <th style={styles.thTd}>Price</th>
            <th style={styles.thTd}>Sold</th>
            <th style={styles.thTd}></th>
            <th style={styles.thTd}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => handleProductClick(product)}
            >
              <td style={styles.thTdTable}>{product.id}</td>
              <td style={styles.thTd}>
                <img src={product.images[0]} alt="Product" style={styles.img} />
              </td>
              <td style={styles.thTdTable}>{product.fullName}</td>
              <td style={styles.thTdTable}>{product.brand}</td>
              <td style={styles.thTdTable}>{product.category}</td>
              <td style={styles.thTdTable}>
                <span>{product.rate}</span>
                <span style={{ color: "yellow", fontSize: 24, marginLeft: 10 }}>
                  ★
                </span>
                <span style={{ color: "gray", marginLeft: 10 }}>
                  ({product.reviews})
                </span>
              </td>
              <td style={styles.thTdTable}>{product.quantity}</td>
              <td style={styles.thTdTable}>${product.price}</td>
              <td style={styles.thTdTable}>{product.sold} items</td>
              <td style={styles.thTd}>
                <button style={styles.editBtn}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              </td>
              <td style={{ borderBottom: "1px solid #ddd" }}>
                <button
                  style={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProduct(product.id);
                  }}
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
              {/* Main Image */}
              <div>
                <img
                  src={selectedProduct.images[currentIndex]}
                  alt="Main"
                  style={styles.mainImage}
                />
              </div>

              {/* Navigation Arrows and Thumbnails */}
              <div style={styles.arrowThumbnailContainer}>
                {/* Left Arrow */}
                <button onClick={handlePrevClick} style={styles.arrowButton}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {/* Thumbnails */}
                <div style={styles.thumbnailContainer}>
                  {selectedProduct.images.map((image, index) => (
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
                        src={image}
                        alt={`Thumbnail ${index}`}
                        style={styles.thumbnailImage}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                <button onClick={handleNextClick} style={styles.arrowButton}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
            <div style={styles.productInfo}>
  <div>
    <h1>{selectedProduct.fullName}</h1>
    <div style={styles.priceRateContainer}>
      <div style={styles.priceContainer}>
        <h4 style={{ fontWeight: "bold" }}>${selectedProduct.salePrice}</h4>
        <h6>
          <span
            style={{ textDecoration: "line-through", color: "gray" }}
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
            {selectedProduct.rate}
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
            {selectedProduct.reviews} Reviews
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
        style={{ backgroundColor: color, ...styles.colorCircle }}
      ></span>
    ))}
  </p>
  <p>
    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
      Sizes:
    </div>
    {selectedProduct.sizes.map((size, idx) => (
      <button key={idx} style={styles.sizeButton}>
        {size}
      </button>
    ))}
  </p>
  <p style={{width: "70%", justifyContent: "space-between", display: "flex"}}>
    <strong>Brand: <span style={{fontWeight: "normal"}}>{selectedProduct.brand}</span></strong> <span></span>
    <strong>Category: <span style={{fontWeight: "normal"}}>{selectedProduct.category}</span></strong> 
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
  container: {
    padding: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
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
    backgroundColor: "blue",
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
  }
};