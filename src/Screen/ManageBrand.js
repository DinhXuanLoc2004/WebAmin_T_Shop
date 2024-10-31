import React from 'react';

const ManageBrand = () => {
  const products = Array(8).fill({
    name: 'UNIQLO',
    productQuantity: 2,
    image: 'https://vanhoaduongpho.com/storage/news/nhung-chiec-ao-khoac-truong-ton-theo-thoi-gian-cua-carhartt-1706612744.png',
  });

  return (
    <div style={styles.container}>
      {products.map((product, index) => (
        <div key={index} style={styles.card}>
          <img src={product.image} alt={product.name} style={styles.image} />
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.price}>{product.productQuantity} products</p>
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
    width: '100%',
    height: 'auto',
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
