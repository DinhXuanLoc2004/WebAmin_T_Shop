import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDashboard,
  faShirt,
  faShoppingCart,
  faThList,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import DashBoard from "../Screen/DashBoard";
import ManageProducts from "../Screen/ManageProducts";
import ManageUser from "../Screen/ManageUser";
import Orders from "../Screen/Orders";
import Setting from "../Screen/Setting";
import ManageCategory from "../Screen/ManageCategory";
import EditProduct from "../Screen/EditProduct";

// Hàm component cho trang Brand
const Brand = () => <h2 style={styles.heading}>Brand</h2>;

export default function Navigation() {
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <Link style={styles.link} to="/dashboard">
              <FontAwesomeIcon icon={faDashboard} style={styles.icon} />
              DashBoard
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link style={styles.link} to="/order">
              <FontAwesomeIcon icon={faShoppingCart} style={styles.icon} />
              Order
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link style={styles.link} to="/products">
              <FontAwesomeIcon icon={faShirt} style={styles.icon} />
              Products
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link style={styles.link} to="/category">
              <FontAwesomeIcon icon={faThList} style={styles.icon} />
              Category
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link style={styles.link} to="/brand">
              <FontAwesomeIcon icon={faShoppingCart} style={styles.icon} />
              Brand
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link style={styles.link} to="/user">
              <FontAwesomeIcon icon={faUser} style={styles.icon} />
              User
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link style={styles.link} to="/setting">
              <FontAwesomeIcon icon={faGear} style={styles.icon} />
              Setting
            </Link>
          </li>
        </ul>
      </nav>
      <div style={styles.content}>
        <Routes>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/order" element={<Orders />} />
          <Route path="/products" element={<ManageProducts />} />
          <Route path="/category" element={<ManageCategory />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/user" element={<ManageUser />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/edit" element={<EditProduct />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    width: "100vw",
    height: "100vh",
  },
  heading: {
    color: "red",
    fontSize: 24,
  },
  nav: {
    marginRight: 60,
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "gray",
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    color: "gray",
    marginRight: 10,
  },
  content: {
    flex: 1, // Đảm bảo phần nội dung chiếm phần còn lại của container
  },
};
