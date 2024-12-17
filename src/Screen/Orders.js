import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCoins,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import NextStatus from "../component/NextStatus";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/v1/api/order/get_all_orders"
        );
        setOrders(response.data.metadata);
        console.log(response.data.metadata);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredItems = orders.filter((order) =>
    order._id.toLowerCase().includes(searchItem.toLowerCase())
  );

  const formatDateTime = (dateString, includeTime = true) => {
    const date = new Date(dateString);
    return includeTime
      ? format(date, "HH:mm/dd-MM-yyyy")
      : format(date, "dd-MM-yyyy");
  };

  const handleRowClick = async (id) => {
    setLoadingDetail(true);
    setIsModalOpen(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/api/order/get_order_detail?order_id=${id}`
      );
      setSelectedOrder(response.data.metadata);
      console.log(response.data.metadata);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const statusColors = {
    Confirming: "blue",
    Confirmed: "green",
    Delivering: "#FFFF66",
    "Delivered Successfully": "green",
    "Delivery Failed": "red",
    Canceled: "red",
    Unpaid: "red",
  };

  const nextStatusMap = {
    Confirming: ["Confirmed"],
    Confirmed: ["Delivering"],
    Delivering: ["Delivered Successfully"],
  };

  const handleUpdateStatus = async (nextStatus) => {
    if (!currentOrder) return;

    const { _id: order_id, order_status } = currentOrder;

    if (!nextStatus) {
      console.log("No next status available for this order.");
      return;
    }

    // Check if the order status is the last status in the sequence
    if (!nextStatusMap[order_status]) {
      console.log("This order is already in the final status.");
      return;
    }

    try {
      // Open the confirmation dialog
      setOpenDialog(true);
      setCurrentOrder(currentOrder); // Save current order to be updated after confirmation
    } catch (error) {
      console.error("Error updating status order:", error);
    }
  };

  const handleConfirmUpdateStatus = async () => {
    if (!currentOrder) return;

    const { _id: order_id, order_status } = currentOrder;
    const nextStatus = nextStatusMap[order_status]?.[0];

    if (!nextStatus) {
      console.log("No next status available for this order.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/v1/api/order/update_status_order",
        {
          order_id,
          status: nextStatus,
        }
      );

      // Update status in the list of orders
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === order_id
            ? { ...order, order_status: nextStatus }
            : order
        )
      );

      // Update currentOrder
      setCurrentOrder((prev) =>
        orders.find((order) => order._id === currentOrder._id)
      );

      console.log("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status order:", error);
    }

    setOpenDialog(false);
  };

  return (
    <div style={styles.container(openDialog)}>
      <input
        type="text"
        placeholder="Search by ID Order"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInput}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.thTd, ...styles.th }}>STT</th>
              <th style={{ ...styles.thTd, ...styles.th }}>ID Order</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Name</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Phone</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Order time</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Leadtime</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Total Amount</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Payment Method</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
              {/* <th style={{ ...styles.thTd, ...styles.th }}>Actions</th> */}
              <th style={{ ...styles.thTd, ...styles.th }}>Note </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((order, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(order._id)}
                style={styles.row}
              >
                <td style={styles.thTdTable}>{index + 1}</td>
                <td style={styles.thTdTable}>{order._id.slice(-4)}</td>
                <td style={styles.thTdTable}>{order.full_name}</td>
                <td style={styles.thTdTable}>{order.phone}</td>
                <td style={styles.thTdTable}>
                  {formatDateTime(order.order_date)}
                </td>
                <td style={styles.thTdTable}>
                  {formatDateTime(order.leadtime, false)}
                </td>
                <td style={styles.thTdTable}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.total_amount)}
                </td>
                <td style={styles.thTdTable}>{order.payment_method}</td>
                <td style={styles.thTdTable}>
                  <select
                    style={{
                      backgroundColor: statusColors[order.order_status],
                      color:
                        order.order_status === "Delivering" ? "black" : "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      width: "100%",
                      cursor: [
                        "Delivered Successfully",
                        "Canceled",
                        "Unpaid",
                      ].includes(order.order_status)
                        ? "not-allowed"
                        : "pointer",
                    }}
                    value={order.order_status}
                    disabled={[
                      "Delivered Successfully",
                      "Canceled",
                      "Unpaid",
                    ].includes(order.order_status)}
                    onChange={() => {
                      const nextStatus = nextStatusMap[order.order_status]?.[0];
                      setCurrentOrder(order);
                      handleUpdateStatus(nextStatus);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <option value={order.order_status} disabled>
                      {order.order_status}
                    </option>
                    {nextStatusMap[order.order_status]?.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={styles.thTdTable}>{order.cancellation_reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <NextStatus
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmUpdateStatus} // Call the confirmation function
      />

      {isModalOpen && (
        <div
          style={styles.modalOverlay}
          onClick={closeModal} // Đóng modal khi nhấn bên ngoài
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra overlay
          >
            {loadingDetail ? (
              <p>Loading...</p>
            ) : selectedOrder ? (
              <div>
                <div style={styles.headerRow}>
                  <p style={styles.headerText}>{selectedOrder.full_name}</p>
                  <p style={styles.headerText}>
                    <strong>ID Order:</strong> {selectedOrder._id}
                  </p>
                </div>
                <div style={{ borderBottom: "1px solid #d3d3d3" }}>
                  <div>
                    <FontAwesomeIcon icon={faLocationDot} style={styles.icon} />
                    Address:
                  </div>
                  <div
                    style={{ display: "flex", gap: "10px", marginLeft: "20px" }}
                  >
                    <div>{selectedOrder.full_name}</div>
                    <div>|</div>
                    <div>{selectedOrder.phone}</div>
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <p style={styles.BodyAddress}>
                      {`${selectedOrder.specific_address}, ${selectedOrder.ward_name}, ${selectedOrder.district_name}, ${selectedOrder.province_name}`}
                    </p>
                  </div>
                </div>
                <ul style={styles.productList}>
                  {selectedOrder.products_order.map((product, index) => (
                    <li key={index} style={styles.productItem}>
                      <div>
                        <img
                          src={product.thumb_color}
                          alt={product.name_product}
                          style={styles.productImage}
                        />
                      </div>
                      <div style={styles.productDetails}>
                        <span style={styles.productName}>
                          {product.name_product}
                        </span>
                        <span style={styles.productColorSize}>
                          Classify: {""}
                          {product.color} - {product.size}
                        </span>
                        <div style={styles.productPriceQuantity}>
                          <div>
                            <span
                              style={{
                                textDecoration: "line-through",
                                marginRight: "10px",
                              }}
                            >
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.price)}
                            </span>
                            <span>
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(
                                product.price -
                                  product.price * (product.discount / 100)
                              )}
                            </span>
                          </div>
                          <span style={styles.productQuantity}>
                            x {product.quantity}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={styles.payment}>
                  <p>
                    <FontAwesomeIcon icon={faCoins} style={styles.icon} />
                    Payment method
                  </p>
                  <div>{selectedOrder.payment_method}</div>
                </div>
                <div style={styles.paymentdetail}>
                  <div>
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      style={styles.icon}
                    />
                    Payment details
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div>Total cost of goods</div>
                      <div>Shipping costs </div>
                      <div>Coupon </div>
                    </div>
                    <div>
                      <div>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          selectedOrder.products_order.reduce(
                            (total, product) =>
                              total +
                              (product.price -
                                product.price * (product.discount / 100)) *
                                product.quantity,
                            0
                          )
                        )}
                      </div>
                      <div>
                        +
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(selectedOrder.delivery_fee)}
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        -
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          selectedOrder.products_order.reduce(
                            (total, product) =>
                              total +
                              (product.price -
                                product.price * (product.discount / 100)) *
                                product.quantity,
                            0
                          ) *
                            (selectedOrder.value_voucher / 100)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <div>Total payment </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      fontSize: "18px",
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedOrder.total_amount)}
                  </div>
                </div>
              </div>
            ) : (
              <p>No details found!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: (isBlurred) => ({
    padding: "20px",
    filter: isBlurred ? "blur(5px)" : "none",
    pointerEvents: isBlurred ? "none" : "auto",
    transition: "filter 0.3s ease",
  }),
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  thTd: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  th: {
    textAlign: "center",
    fontWeight: "normal",
    backgroundColor: "#f5f5f5",
  },
  thTdTable: {
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  searchInput: {
    padding: "8px 8px 8px 30px",
    width: "45%",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "30px",
  },
  row: {
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  rowHover: {
    backgroundColor: "#f9f9f9",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Nền mờ
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    color: "#666",
    cursor: "pointer",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Màu xám nhẹ
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  headerRow1: {
    borderBottom: "1px solid #d3d3d3 ",
    paddingBottom: "10px",
  },
  headerText: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#333",
  },
  icon: {
    marginRight: "8px",
    color: "red",
  },
  BodyAddress: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    margin: "5px 0",
    lineHeight: "1.5",
  },
  productImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "5px",
    marginRight: "10px",
  },
  productList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    borderBottom: "1px solid #d3d3d3 ",
  },
  productItem: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 0",
  },
  productDetails: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontWeight: "700",
  },
  productColorSize: {
    fontSize: "14px",
    color: "#666",
  },
  productPriceQuantity: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#333",
  },
  productPrice: {
    marginRight: "10px",
  },
  productQuantity: {
    color: "#999",
  },
  payment: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    borderBottom: "1px solid #d3d3d3",
  },
  paymentdetail: {
    marginTop: "10px",
    borderBottom: "1px solid #d3d3d3",
  },
  modalInput: {
    display: "block",
    margin: "10px 0",
    padding: "8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  modalButton: {
    margin: "10px 5px 0",
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  },
};
