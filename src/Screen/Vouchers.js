import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteDialog from "../component/DeleteDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
export default function Vouchers() {
  // Hàm gọi API xóa voucher
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editVoucher, setEditVoucher] = useState({}); // Voucher đang được chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (voucher) => {
    console.log("Voucher:", voucher);
    setEditVoucher(voucher);
    setIsEditModalOpen(true);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditVoucher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditSubmit = async () => {
    try {
      // Chỉ truyền _id vào URL, và toàn bộ editVoucher vào body
      console.log("editVoucher._id:", editVoucher); //
      await axios.put(
        `http://localhost:5000/v1/api/voucher/update_voucher?_id=${editVoucher._id}`,
        editVoucher
      );
      setIsEditModalOpen(false);
      fetchVouchers(); // Làm mới danh sách
    } catch (error) {
      console.error("Error updating voucher:", error);
    }
  };

  const confirmDelete = (_id) => {
    setVoucherToDelete(_id);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete voucher
  const handleDeleteVoucher = async () => {
    if (!voucherToDelete) return;
    try {
      await axios.patch(
        `http://localhost:5000/v1/api/voucher/toggle_active_voucher?_id=${voucherToDelete}`
      );
      fetchVouchers();
    } catch (error) {
      console.error("Error deleting voucher:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setVoucherToDelete(null);
    }
  };

  const [searchItem, setSearchItem] = useState("");
  const [voucher, setVoucher] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setViewShowModal] = useState(false);
  const [detailVoucher, setDetailVoucher] = useState("");
  const [newVoucher, setNewVoucher] = useState({
    voucher_name: "",
    voucher_description: "",
    voucher_type: "percent",
    voucher_value: 0,
    voucher_code: "",
    image: null,
    time_start: "",
    time_end: "",
    quantity: 0,
    min_order_value: 0,
    is_active: true,
    is_voucher_new_user: false,
  });
  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/api/voucher/get_all_vouchers/admin"
      );
      const allVouchers = response.data.metadata || []; // Lấy dữ liệu trả về từ API
      const activeVouchers = allVouchers.filter((voucher) => voucher.is_active); // Lọc các voucher is_active = true

      setVoucher(activeVouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };
  const getDetailVoucher = async (_id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/api/voucher/get_detail_voucher/`,
        { params: { _id: _id } }
      );
      setDetailVoucher(response.data.metadata);
      setViewShowModal(true);
    } catch (error) {
      console.error("Error getting detail:", error);
    }
  };

  // Fetch vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/v1/api/voucher/get_all_vouchers/admin"
        );
        const allVouchers = response.data.metadata || []; // Lấy dữ liệu trả về từ API
        const activeVouchers = allVouchers.filter(
          (voucher) => voucher.is_active
        ); // Lọc các voucher is_active = true

        setVoucher(activeVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVoucher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewVoucher((prev) => ({ ...prev, image: file }));
  };

  // Submit new voucher
  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(newVoucher).forEach(([key, value]) => {
      formData.append(key, value);
    });

    setIsLoading(true); // Bật trạng thái loading
    try {
      await axios.post(
        "http://localhost:5000/v1/api/voucher/create_voucher",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Voucher added successfully!");
      setShowModal(false);
      setNewVoucher({
        voucher_name: "",
        voucher_description: "",
        voucher_type: "percent",
        voucher_value: 0,
        voucher_code: "",
        image: null,
        time_start: "",
        time_end: "",
        quantity: "",
        min_order_value: 0,
        is_active: true,
        is_voucher_new_user: false,
      });
      fetchVouchers();
    } catch (error) {
      console.error("Error creating voucher:", error);
      alert("Failed to add voucher.");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  const filteredItems = (voucher || []).filter((item) =>
    (item?.voucher_code || "")
      .toLowerCase()
      .includes((searchItem || "").toLowerCase())
  );
  console.log("aaa", filteredItems);
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={styles.searchInPut}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>STT</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher name</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher type</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher value</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Voucher code</th>
            <th style={{ ...styles.thTd, ...styles.th }}>MFG Date</th>
            <th style={{ ...styles.thTd, ...styles.th }}>EXP Date</th>
            <th style={{ ...styles.thTd, ...styles.th, marginLeft: "30px" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((voucher, index) => (
            <tr key={voucher._id}>
              <td style={styles.thTd}>{index + 1}</td>

              <td
                onClick={() => getDetailVoucher(voucher._id)}
                style={{ ...styles.thTd, color: "Brown", fontWeight: 700 }}
              >
                {voucher.voucher_name}
              </td>
              <td style={styles.thTd}>{voucher.voucher_type}</td>
              <td style={styles.thTd}>{voucher.voucher_value}</td>
              <td style={{ ...styles.thTd, color: "red", fontWeight: 700 }}>
                {voucher.voucher_code}
              </td>
              <td style={styles.thTd}>
                {new Date(voucher.time_start).toLocaleDateString()}
              </td>
              <td style={styles.thTd}>
                {new Date(voucher.time_end).toLocaleDateString()}
              </td>
              <td style={styles.thTd}>
                <button
                  style={styles.editBtn}
                  onClick={() => openEditModal(voucher)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => confirmDelete(voucher._id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.addButton} onClick={() => setShowModal(true)}>
        +
      </div>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteVoucher}
      />

      {showModal && (
        <div style={styles.modal}>
          <h2 style={styles.modalHeader}>Add Voucher</h2>
          <input
            type="text"
            name="voucher_name"
            placeholder="Voucher Name"
            value={newVoucher.voucher_name}
            onChange={handleChange}
            style={styles.input}
          />
          <textarea
            name="voucher_description"
            placeholder="Description"
            value={newVoucher.voucher_description}
            onChange={handleChange}
            style={styles.textarea}
          />
          <select
            name="voucher_type"
            value={newVoucher.voucher_type}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="percent">Percent</option>
            <option value="deduct_money">Deduct Money</option>
            <option value="complete_coin">Complete Coin</option>
          </select>
          <input
            type="number"
            name="voucher_value"
            placeholder="Value"
            value={newVoucher.voucher_value}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="voucher_code"
            placeholder="Code"
            value={newVoucher.voucher_code}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="file"
            name="image"
            onChange={handleImageUpload}
            style={styles.input}
          />
          <input
            type="datetime-local"
            name="time_start"
            value={newVoucher.time_start}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="datetime-local"
            name="time_end"
            value={newVoucher.time_end}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newVoucher.quantity}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="number"
            name="min_order_value"
            placeholder="Min Order Value"
            value={newVoucher.min_order_value}
            onChange={handleChange}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button
              style={styles.saveButton}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div style={styles.loadingSpinner}></div> // Vòng tròn loading
              ) : (
                "Save"
              )}
            </button>
            <button
              style={styles.cancelButton}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showViewModal && detailVoucher && (
        <div style={styles.modal}>
          <h2 style={styles.modalHeader}>Voucher Details</h2>
          <div style={styles.content}>
            <p>
              <strong>Name:</strong> {detailVoucher.voucher_name}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {detailVoucher.voucher_description.length > 50
                ? `${detailVoucher.voucher_description.slice(0, 50)}...`
                : detailVoucher.voucher_description}
            </p>
            <p>
              <strong>Type:</strong> {detailVoucher.voucher_type}
            </p>
            <p>
              <strong>Value:</strong> {detailVoucher.voucher_value}
            </p>
            <p>
              <strong>Code:</strong> {detailVoucher.voucher_code}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(detailVoucher.time_start).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(detailVoucher.time_end).toLocaleDateString()}
            </p>
            <p>
              <strong>Quantity:</strong> {detailVoucher.quantity}
            </p>
          </div>
          <button
            style={styles.closeButton}
            onClick={() => setViewShowModal(false)}
          >
            Close
          </button>
        </div>
      )}
      {isEditModalOpen && editVoucher && (
        <div style={styles.modal}>
          <h2 style={styles.modalHeader}>Edit Voucher</h2>
          <input
            type="text"
            name="voucher_name"
            placeholder="Voucher Name"
            value={editVoucher.voucher_name}
            onChange={handleEditChange}
            style={styles.input}
          />
          <textarea
            name="voucher_description"
            placeholder="Description"
            value={editVoucher.voucher_description}
            onChange={handleEditChange}
            style={styles.textarea}
          />
          <select
            name="voucher_type"
            value={editVoucher.voucher_type}
            onChange={handleEditChange}
            style={styles.select}
          >
            <option value="percent">Percent</option>
            <option value="deduct_money">Deduct Money</option>
            <option value="complete_coin">Complete Coin</option>
          </select>
          <input
            type="number"
            name="voucher_value"
            placeholder="Value"
            value={editVoucher.voucher_value}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="text"
            name="voucher_code"
            placeholder="Code"
            value={editVoucher.voucher_code}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="datetime-local"
            name="time_start"
            value={editVoucher.time_start}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="datetime-local"
            name="time_end"
            value={editVoucher.time_end}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={editVoucher.quantity}
            onChange={handleEditChange}
            style={styles.input}
          />
          <input
            type="number"
            name="min_order_value"
            placeholder="Min Order Value"
            value={editVoucher.min_order_value}
            onChange={handleEditChange}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button
              style={styles.saveButton}
              onClick={handleEditSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div style={styles.loadingSpinner}></div> // Vòng tròn loading
              ) : (
                "Save"
              )}
            </button>
            <button
              style={styles.cancelButton}
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  thTd: { padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" },
  th: { backgroundColor: "#f5f5f5" },
  searchInPut: {
    padding: "8px",
    width: "45%",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    marginBottom: "30px",
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
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)", // Tăng độ bóng đổ
    zIndex: 1000,
    width: "500px",
    border: "2px solid red", // Thêm đường viền nhẹ để nổi bật
  },
  modalHeader: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    minHeight: "80px",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    zIndex: 1000,
    border: "1px solid #ddd",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "500px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  modalHeader: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#555",
  },
  content: {
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
  },
  delButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  loadingSpinner: {
    width: "24px",
    height: "24px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 2s linear infinite",
  },
  editButton: {
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
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
};
