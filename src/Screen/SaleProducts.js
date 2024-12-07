import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesActive = () => {
    const [salesActive, setSalesActive] = useState([]);  // Lưu trữ các đợt giảm giá đang hoạt động
    const [salesInactive, setSalesInactive] = useState([]);  // Lưu trữ các đợt giảm giá không còn hoạt động
    const [loading, setLoading] = useState(true);  // Để hiển thị loading
    const [error, setError] = useState(null);  // Để hiển thị lỗi nếu có
    const [newSale, setNewSale] = useState({
        discount: '',
        time_start: '',
        time_end: '',
        product_ids: '', // Chuỗi JSON của IDs
        name_sale: '',
        image: { file: null, url: '' },
    });
    const [message, setMessage] = useState("");  // Để hiển thị thông báo khi tạo đợt giảm giá mới
    const [isModalVisible, setModalVisible] = useState(false); // Trạng thái điều khiển modal (hiển thị/ẩn)

    // Hàm để gọi API lấy danh sách đợt giảm giá
    const fetchSales = async () => {
        try {
            const responseActive = await axios.get('http://localhost:5000/v1/api/sale/get_sales_active?active=true');
            setSalesActive(responseActive.data.metadata);  // Cập nhật state salesActive

            const responseInactive = await axios.get('http://localhost:5000/v1/api/sale/get_sales_active?active=false');
            setSalesInactive(responseInactive.data.metadata);  // Cập nhật state salesInactive

            setLoading(false);  // Tắt loading khi đã có dữ liệu
        } catch (err) {
            setError('Error fetching data. Please try again later.');  // Hiển thị lỗi nếu có
            setLoading(false);  // Tắt loading khi có lỗi
        }
    };

    // Gọi fetchSales khi component mount để tải dữ liệu ban đầu
    useEffect(() => {
        fetchSales();
    }, []);

    // Hàm xử lý khi không có dữ liệu
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Hàm xử lý thay đổi trong form (cập nhật thông tin sale)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSale(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Hàm xử lý thay đổi ảnh khi người dùng chọn file
    const handleImageChange = (e) => {
        const file = e.target.files[0];  // Lấy tệp đầu tiên từ người dùng
        if (file) {
            setNewSale(prevState => ({
                ...prevState,
                image: {
                    ...prevState.image,
                    file: file,  // Lưu lại đối tượng file thay vì URL base64
                    url: URL.createObjectURL(file), // Tạo URL tạm thời cho file ảnh
                }
            }));
        }
    };

    // Hàm gửi yêu cầu POST khi tạo đợt giảm giá mới
    const handleAddSale = async () => {
      try {
          // Validate the form fields
          if (!newSale.discount || !newSale.time_start || !newSale.time_end || !newSale.name_sale || !newSale.product_ids) {
              setMessage('All fields are required. Please check the form.');
              alert('All fields are required. Please check the form.'); // Alert on error
              return;
          }
  
          // Validate product_ids (must be a valid JSON array)
          let productIdsArray = [];
          try {
              // Try to parse the product_ids input into a JSON array
              productIdsArray = JSON.parse(newSale.product_ids);
              
              // Check if the parsed value is an array
              if (!Array.isArray(productIdsArray)) {
                  setMessage('Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).');
                  alert('Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).');
                  return;
              }
          } catch (e) {
              setMessage('Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).');
              alert('Product IDs must be a valid JSON array (e.g., ["1", "2", "3"]).');
              return;
          }
  
          // If the product IDs array is empty, show an error message
          if (productIdsArray.length === 0) {
              setMessage('Product IDs cannot be empty.');
              alert('Product IDs cannot be empty.');
              return;
          }
  
          // If image is selected, check if it's a valid image file
          if (newSale.image.file && !newSale.image.file.type.startsWith('image')) {
              setMessage('Please upload a valid image.');
              alert('Please upload a valid image.');
              return;
          }
  
          // If no image is selected, don't include it in FormData
          const formData = new FormData();
          formData.append('discount', newSale.discount);
          formData.append('time_start', newSale.time_start);
          formData.append('time_end', newSale.time_end);
          formData.append('product_ids', JSON.stringify(productIdsArray));  // Chuyển sang mảng
          formData.append('name_sale', newSale.name_sale);
  
          if (newSale.image.file) {
              formData.append('image', newSale.image.file);  // Gửi ảnh bằng đối tượng File
          }
  
          // Debugging: Check FormData contents
          for (let pair of formData.entries()) {
              console.log(pair[0]+ ': ' + pair[1]);
          }
  
          const response = await axios.post('http://localhost:5000/v1/api/sale/add_sale', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',  // Đảm bảo gửi dưới dạng multipart/form-data
              },
          });
  
          // If the request is successful
          if (response.data.success) {
              alert('Add Success');  // Alert on success
              fetchSales(); // Cập nhật lại danh sách
              setModalVisible(false); // Đóng modal sau khi thêm thành công
          } else {
              alert('Error: ' + response.data.message || 'An error occurred. Please try again.');
              setModalVisible(false);  // Close the modal on error as well
          }
      } catch (err) {
          alert('Error creating sale. Please check the form and try again.');  // Alert on error
          console.error('Error:', err.response ? err.response.data : err);
          setModalVisible(false);  // Close modal on failure
      }
  };
  
    // Hàm để đóng modal mà không lưu
    const handleCancel = () => {
        setModalVisible(false);  // Đóng modal khi nhấn Cancel
    };

    return (
        <div>
            <h1>All Sales</h1>
            <button onClick={() => setModalVisible(true)}>Add Sale</button>

            {/* Modal Form để thêm đợt giảm giá mới */}
            {isModalVisible && (
                <div style={{ ...styles.modal, ...(isModalVisible && styles.modalVisible) }}>
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
                                <img src={newSale.image.url} alt="Selected" style={styles.selectedImage} />
                            </div>
                        )}
                        <div>
                            <button onClick={handleAddSale} style={styles.button}>Add Sale</button>
                            <button onClick={handleCancel} style={styles.buttonCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hiển thị các đợt giảm giá đang hoạt động */}
            <h2>Active Sales</h2>
            {salesActive.length === 0 ? (
                <p>No active sales at the moment.</p>
            ) : (
                <div>
                    {salesActive.map((sale) => (
                        <div key={sale._id} style={styles.saleCard}>
                            <img src={sale.thumb || 'https://via.placeholder.com/150'} alt={sale.name_sale} style={styles.thumbnail} />
                            <div style={styles.info}>
                                <h3>{sale.name_sale}</h3>
                                <p><strong>Discount:</strong> {sale.discount}%</p>
                                <p><strong>Start:</strong> {new Date(sale.time_start).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(sale.time_end).toLocaleString()}</p>
                                <p><strong>Status:</strong> Active</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hiển thị các đợt giảm giá không còn hoạt động */}
            <h2>Inactive Sales</h2>
            {salesInactive.length === 0 ? (
                <p>No inactive sales at the moment.</p>
            ) : (
                <div>
                    {salesInactive.map((sale) => (
                        <div key={sale._id} style={styles.saleCard}>
                            <img src={sale.thumb || 'https://via.placeholder.com/150'} alt={sale.name_sale} style={styles.thumbnail} />
                            <div style={styles.info}>
                                <h3>{sale.name_sale}</h3>
                                <p><strong>Discount:</strong> {sale.discount}%</p>
                                <p><strong>Start:</strong> {new Date(sale.time_start).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(sale.time_end).toLocaleString()}</p>
                                <p><strong>Status:</strong> Inactive</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    saleCard: {
        display: 'flex',
        marginBottom: '20px',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '8px',
        alignItems: 'center',
    },
    thumbnail: {
        width: '100px',
        height: '100px',
        marginRight: '20px',
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
    },
    modalVisible: {
        opacity: 1,
        pointerEvents: 'auto',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        width: '450px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    input: {
        width: '100%',
        padding: '0px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '1px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    buttonCancel: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        marginLeft: '10px',
    },
    selectedImage: {
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        marginTop: '10px',
    },
};

export default SalesActive;
