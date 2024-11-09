import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBrand = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách các thương hiệu
    axios.get('http://192.168.1.51:5000/v1/api/brand/get_all_brands')
      .then(response => {
        setBrands(response.data.metadata); // Giả sử dữ liệu trả về từ API có định dạng { metadata: [...] }
      })
      .catch(error => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  return (
    <div style={styles.container}>
      {brands.map((brand, index) => (
        <div key={index} style={styles.card}>
          <img src={brand.image_brand.url} alt={brand.name_brand} style={styles.image} />
          <h3 style={styles.name}>{brand.name_brand}</h3>
          <p style={styles.price}>2 products</p> {/* Số lượng sản phẩm này có thể tuỳ chỉnh */}
          <div style={styles.buttonContainer}>
            <button style={styles.editButton}>EDIT</button>
            <button style={styles.deleteButton}>DELETE</button>
          </div>
        </div>
      ))}
      <div style={styles.addButton}>+</div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '20px',
    position: 'relative',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: 250,
    height: 300,
    marginBottom: '10px',
  },
  name: {
    fontSize: '25px',
    margin: '10px 0',
  },
  price: {
    color: '#555',
    marginBottom: '10px',
    fontSize: '18px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '24px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  },
};

export default ManageBrand;
