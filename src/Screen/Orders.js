import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Orders() {
  const [order, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/v1/api/order/get_all_orders"
        );
        setOrders(response.data.metadata);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const [searchItem, setSearchItem] = useState("");
  const filteredItems = order.filter((order) =>
    order.user_id.toLowerCase().includes(searchItem.toLowerCase())
  );
  const [showAlert, setShowAlert] = useState(false);

  const handleOpen = () => setShowAlert(true);
  const handleClose = () => setShowAlert(false);
  const handleConfirm = () => {
    console.log("Xóa dữ liệu");
    handleClose();
  };
  //call api get all product để hiển thị ảnh product_orderr
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/v1/api/product/get_all_products"
        );

        const productsData = response.data?.metadata?.products || [];
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.warn("Dữ liệu sản phẩm không hợp lệ:", productsData);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, []);
  
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
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Products</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created At</th>
            <th style={styles.th}>Deadline</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Phone Number</th>
            <th style={styles.th}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((order, index) => (
            <tr key={index}>
              <td style={styles.thTdTable}>{order._id}</td>
              <td style={styles.thTd}>
                {order.products_order.map((product, idx) => {
                  const productInfo = products.find(
                    (p) => p._id === product.product_variant_id
                  ); 
                  console.log("A",productInfo);
                  
                  return (
                    <div key={idx}>
                      <span>
                        Tên sản phẩm:{" "}
                        {productInfo?.name_product || "Không tìm thấy"}
                      </span>
                      , <span>Số lượng: {product.quantity}</span>,{" "}
                      <span>Giá: {product.price}</span>
                    </div>
                  );
                })}
              </td>

              <td style={styles.thTdTable}>{order.full_name}</td>
              <td style={styles.thTd}>
                <span
                  style={{
                    ...styles.status,
                    ...(order.order_status === "confirming"
                      ? styles.completeStatus
                      : order.order_status === "Pending"
                      ? styles.pendingStatus
                      : styles.rejectStatus),
                  }}
                >
                  {order.order_status}
                </span>
              </td>
              <td style={styles.thTd}>{order.createdAt}</td>
              <td style={{ ...styles.thTd, fontWeight: 600, color: "red" }}>
                {order.leadtime}
              </td>
              <td style={styles.thTd}>
                <div style={styles.addressContainer}>
                  <span>{order.province_name}, </span>
                  <span>{order.district_name}</span>
                </div>
              </td>
              <td style={styles.thTd}>{order.phone}</td>
              <td style={{ ...styles.thTd, fontWeight: 700, color: "black" }}>
                {order.total_amount}
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
    fontFamily: "Arial, sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: "12px 15px",
    fontWeight: "bold",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  thTdTable: {
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    maxWidth: "200px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontWeight: "normal",
    color: "#555",
  },
  thTd: {
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    fontWeight: "normal",
    color: "#555",
  },
  status: {
    padding: "5px 10px",
    borderRadius: "12px",
    color: "white",
  },
  completeStatus: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  pendingStatus: {
    backgroundColor: "#ffc107",
    color: "#fff",
  },
  rejectStatus: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  editBtn: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  searchInPut: {
    padding: "8px 8px 8px 30px",
    width: "45%",
    boxSizing: "border-box",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "30px",
    border: "1px solid #ddd",
    transition: "border-color 0.3s",
  },
  addressContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
};
