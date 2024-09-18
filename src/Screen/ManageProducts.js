import React, { useState } from "react";
import StarComponent from "../component/StarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
export default function ManageProducts() {
  const products = [
    {
      id: "709 - 230",
      image: "https://via.placeholder.com/50",
      fullName: "Jádasdack",
      brand: "Uniqlo",
      category: "Inactive",
      rate: 3,
      reviews: 3,
      quantity: 3,
      price: 3,
      size: 32,
      color: "red",
      sold: 12,
    },
    {
      id: "709 - 230",
      image: "https://via.placeholder.com/50",
      fullName: "Jádasdack",
      brand: "Uniqlo",
      category: "Inactive",
      rate: 3,
      reviews: 3,
      quantity: 3,
      price: 3,
      size: 32,
      color: "red",
      sold: 12,
    },
    {
      id: "709 - 230",
      image: "https://via.placeholder.com/50",
      fullName: "Bádasdack",
      brand: "Uniqlo",
      category: "Inactive",
      rate: 1,
      reviews: 31,
      quantity: 3,
      price: 3,
      size: 32,
      color: "red",
      sold: 12,
    },
    {
      id: "709 - 230",
      image:
      "data:image/webp;base64,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",
      fullName: "Jádasdack",
      brand: "Uniqlo",
      category: "Inactive",
      rate: 3,
      reviews: 13,
      quantity: 3,
      price: 3,
      size: 32,
      color: "red",
      sold: 12,
    },
  ];
  const [searchItem, setSearchItem] = useState("");
  const filteredItems = products.filter((products) =>
    products.fullName.toLowerCase().includes(searchItem.toLowerCase())
  );
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search..."
        value={searchItem} // Gán giá trị của state vào input
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInPut}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>ID User</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Image</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Products</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Brand</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Category</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Rate</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Quantity</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Price</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Size</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Color</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Sold</th>
            <th style={{ ...styles.thTd, ...styles.th }}></th>
            <th style={{ ...styles.thTd, ...styles.th }}></th>
          </tr>
        </thead>
        <tbody style={{ paddingLeft: 100 }}>
          {filteredItems.map((product, index) => (
            <tr key={index}>
              <td style={{ ...styles.thTdTable, width: "90%" }}>
                {product.id}
              </td>
              <td style={styles.thTd}>
                <img src={product.image} alt="Product" style={styles.img} />
              </td>
              <td style={styles.thTdTable}>{product.fullName}</td>
              <td style={styles.thTdTable}>{product.brand}</td>
              <td style={styles.thTdTable}>
                <span>{product.category}</span>
              </td>
              <td
                style={{
                  ...styles.thTd,
                  width: 20,
                  flexDirection: "row",
                  display: "flex",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <text style={{ marginBottom: 10 }}>{product.rate}</text>
                <FontAwesomeIcon
                  icon={faStar}
                  style={{ color: "#FEC53D", marginBottom: 10 }}
                />
                <text style={{ marginBottom: 10, color: "gray" }}>
                  ({product.reviews})
                </text>
              </td>
              <td style={{ ...styles.thTdTable, paddingLeft: 60 }}>
                {product.quantity}
              </td>
              <td style={styles.thTdTable}>${product.price}</td>
              <td style={styles.thTdTable}>{product.size}</td>
              <td style={styles.thTdTable}>{product.color}</td>
              <td style={styles.thTdTable}>{product.sold} Items</td>

              <td style={styles.thTd}>
                <button
                  style={styles.editBtn}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.editBtn.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.editBtnHover.backgroundColor)
                  }
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>
              <td style={{ ...styles.thTd, paddingLeft: 10 }}>
                <button
                  style={styles.deletekBtn}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.deletekBtn.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.deleteBtnHover.backgroundColor)
                  }
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const styles = {
  container: {
    padding: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  thTd: {
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingTop: "10px",
    fontWeight: "normal",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    gap: 10,
  },
  thTdTable: {
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingTop: "10px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    gap: 10,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  th: {
    backgroundColor: "#f5f5f5",
  },
  img: {
    width: "40px",
    height: "40px",
  },
  status: {
    padding: "5px 10px",
    borderRadius: "12px",
    color: "white",
  },
  actionStatus: {
    backgroundColor: "#d1e7ff",
    color: "#007bff",
  },
  inactiveStatus: {
    backgroundColor: "#d4edda",
    color: "#28a745",
  },
  editBtn: {
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    width: 70,
    height: 40,
  },
  editBtnHover: {
    backgroundColor: "#003CFF",
  },
  deletekBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    width: 80,
    height: 40,
  },
  deleteBtnHover: {
    backgroundColor: "#c82333",
  },
  h3: {
    fontWeight: "normal",
  },
  searchInPut: {
    padding: "8px 8px 8px 30px",
    width: "45%",
    boxSizing: "border-box",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s",
    marginTop: "10px",
    marginBottom: "30px",
  },
  searchInPut: {
    padding: "8px 8px 8px 30px",
    width: "45%",
    boxSizing: "border-box",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s",
    marginTop: "10px",
    marginBottom: "30px",
  },
};
