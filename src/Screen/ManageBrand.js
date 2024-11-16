import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddBrandModal from '../component/AddBrandModal';

const ManageBrand = () => {
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleAddBrand = (newBrand) => {
    setBrands((prevBrands) => [...prevBrands, newBrand]);
  };

  const handleDeleteBrand = (id) => {
    axios.delete(`http://localhost:5000/v1/api/brand/delete_brand?id=${id}`)
      .then(() => {
        setBrands(prevBrands => prevBrands.filter(brand => brand._id !== id));
      })
      .catch(error => {
        console.error("Error deleting brand:", error);
      });
  };

  const handleEditBrand = (updatedBrand) => {
    axios.put(`http://localhost:5000/v1/api/brand/update_brand?id=${updatedBrand._id}`, updatedBrand)
      .then(response => {
        setBrands(prevBrands => prevBrands.map(brand => 
          brand._id === updatedBrand._id ? response.data : brand
        ));
        setIsEditModalOpen(false);
      })
      .catch(error => {
        console.error("Error updating brand:", error);
      });
  };

  useEffect(() => {
    axios.get('http://localhost:5000/v1/api/brand/get_all_brands')
      .then(response => {
        setBrands(response.data.brands);
      })
      .catch(error => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  return (
    <div style={styles.container}>
      {brands.map((brand, index) => (
        <div key={index} style={styles.card}>
          {brand.image_brand?.url ? (
            <img src={brand.image_brand.url} alt={brand.name_brand} style={styles.image} />
          ) : (
            <p>No image available</p>
          )}
          <h3 style={styles.name}>{brand.name_brand}</h3>
          <p style={styles.price}>2 products</p>
          <div style={styles.buttonContainer}>
            <button style={styles.editButton} onClick={() => { setSelectedBrand(brand); setIsEditModalOpen(true); }}>EDIT</button>
            <button style={styles.deleteButton} onClick={() => handleDeleteBrand(brand._id)}>DELETE</button>
          </div>
        </div>
      ))}
      <div onClick={() => setIsModalOpen(true)} style={styles.addButton}>+</div>
      <AddBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBrand={handleAddBrand}
      />

      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Edit Brand</h2>
            <input
              type="text"
              placeholder="Brand Name"
              value={selectedBrand?.name_brand || ''}
              onChange={(e) => setSelectedBrand({ ...selectedBrand, name_brand: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={selectedBrand?.image_brand?.url || ''}
              onChange={(e) =>
                setSelectedBrand({
                  ...selectedBrand,
                  image_brand: { ...selectedBrand.image_brand, url: e.target.value },
                })
              }
              style={styles.input}
            />
            <button onClick={() => handleEditBrand(selectedBrand)} style={styles.saveButton}>
              Save
            </button>
            <button onClick={() => setIsEditModalOpen(false)} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ManageBrand;
