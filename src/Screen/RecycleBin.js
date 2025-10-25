import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const RecycleBin = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colorAndSizes, setColorAndSizes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // State to track selected tab

  const fetchData = async () => {
    try {
      // Fetch deleted products
      const productResult = await axios.post(
        `http://localhost:5000/v1/api/product/get_all_products?is_delete=${true}`
      );
      setProducts(productResult.data.metadata.products);

      // Fetch deleted brands
      const brandResult = await axios.get(
        `http://localhost:5000/v1/api/brand/get_all_brands?is_delete=${true}`
      );
      setBrands(brandResult.data.metadata);

      // Other fetch logic for categories and colorAndSizes can go here...
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleRestoreProduct = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/v1/api/product/toggle_delete_product?_id=${productId}`
      );
      fetchData();
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  const handleRestoreBrand = async (brandId) => {
    try {
      await axios.delete(
        `https://backenddatn-production.up.railway.app/v1/api/brand/toggle_delete_brand?_id=${brandId}`
      );
      fetchData();
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Recycle Bin</h1>

      <Tabs
        selectedIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      >
        <TabList style={styles.tabList}>
          {["Products", "Brands", "Categories", "Color and Size"].map(
            (tabName, index) => (
              <Tab
                key={index}
                style={{
                  ...styles.tab,
                  backgroundColor: selectedTab === index ? "red" : "gray",
                }}
              >
                {tabName}
              </Tab>
            )
          )}
        </TabList>

        {/* Products Tab */}
        <TabPanel>
          <h2 style={styles.tabTitle}>Products</h2>
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
              {products.map((product, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.thTdTable}>{index + 1}</td>
                  <td style={styles.thTd}>
                    <img src={product.thumb} alt="Product" style={styles.img} />
                  </td>
                  <td style={styles.thTdTable}>{product.name_product}</td>
                  <td style={styles.thTdTable}>{product.name_brand}</td>
                  <td style={styles.thTdTable}>{product.name_category}</td>
                  <td style={styles.thTdTable}>
                    <span>{product.rate}</span>
                    <span style={styles.star}>★</span>
                    <span style={styles.averageRating}>
                      ({product.averageRating})
                    </span>
                  </td>
                  <td style={styles.thTdTable}>{product.inventory_quantity}</td>
                  <td style={styles.thTdTable}>${product.price_min}</td>
                  <td style={styles.thTdTable}>
                    <button
                      style={styles.restoreBtn}
                      onClick={() => handleRestoreProduct(product._id)}
                    >
                      <FontAwesomeIcon icon={faTrashRestore} /> Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        {/* Brands Tab */}
        <TabPanel>
          <h2 style={styles.tabTitle}>Brands</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thTd}>STT</th>
                <th style={styles.thTd}>Image</th>
                <th style={styles.thTd}>Name</th>
                <th style={styles.thTd}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.thTdTable}>{index + 1}</td>
                  <td style={styles.thTd}>
                    <img
                      src={brand.image_brand.url}
                      alt="Product"
                      style={styles.img}
                    />
                  </td>
                  <td style={styles.thTdTable}>{brand.name_brand}</td>
                  <td style={styles.thTdTable}>
                    <button
                      style={styles.restoreBtn}
                      onClick={() => handleRestoreBrand(brand._id)}
                    >
                      <FontAwesomeIcon icon={faTrashRestore} /> Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        {/* Categories Tab */}
        <TabPanel>
          <h2 style={styles.tabTitle}>Categories</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thTd}>STT</th>
                <th style={styles.thTd}>Image</th>
                <th style={styles.thTd}>Name</th>
                <th style={styles.thTd}>Depth</th>
                <th style={styles.thTd}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.thTdTable}>{index + 1}</td>
                  <td style={styles.thTd}>
                    <img
                      src={category.image_category.url}
                      alt="Product"
                      style={styles.img}
                    />
                  </td>
                  <td style={styles.thTdTable}>{category.name_category}</td>
                  <td style={styles.thTdTable}>{category.depth}</td>
                  <td style={styles.thTdTable}>
                    <button
                      style={styles.restoreBtn}
                      onClick={() => handleRestoreProduct()}
                    >
                      <FontAwesomeIcon icon={faTrashRestore} /> Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        {/* Color and Size Tab */}
        <TabPanel>
          <h2 style={styles.tabTitle}>Color and Size</h2>
          <ul style={styles.list}>
            {colorAndSizes.map((colorSize, index) => (
              <li key={index} style={styles.listItem}>
                {colorSize.color} / {colorSize.size} -{" "}
                <button
                  style={styles.restoreBtn}
                  onClick={() => handleRestoreProduct(colorSize._id)}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default RecycleBin;

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "'Arial', sans-serif",
  },
  tabList: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    listStyle: "none",
  },
  tab: {
    padding: "10px 20px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    border: "none",
    borderRadius: "4px",
  },
  tabTitle: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  thTd: {
    padding: "12px 15px",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
  },
  thTdTable: {
    padding: "12px 15px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
  },
  img: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  tr: {
    transition: "background-color 0.3s",
  },
  star: {
    color: "yellow",
    fontSize: "24px",
    marginLeft: "10px",
  },
  averageRating: {
    color: "gray",
    marginLeft: "10px",
  },
  restoreBtn: {
    padding: "8px 15px",
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    padding: "10px 0",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
  },
};
