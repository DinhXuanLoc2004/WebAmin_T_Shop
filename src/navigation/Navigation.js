import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDashboard,
  faShirt,
  faRuler,
  faShoppingCart,
  faThList,
  faGear,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

// Các hàm component cho các trang
const DashBoard = () => <h2 style={styles.heading}>DashBoard</h2>;
const Order = () => <h2 style={styles.heading}>Order</h2>;
const Products = () => <h2 style={styles.heading}>Products</h2>;
const Category = () => <h2 style={styles.heading}>Category</h2>;
const Brand = () => <h2 style={styles.heading}>Brand</h2>;
const Size = () => <h2 style={styles.heading}>Size</h2>;
const User = () => <h2 style={styles.heading}>User</h2>;
const Color = () => <h2 style={styles.heading}>Color</h2>;
const Setting = () => <h2 style={styles.heading}>Setting</h2>;

export default function Navigation() {
  return (
    <Router>
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
              <Link style={styles.link} to="/size">
                <FontAwesomeIcon icon={faRuler} style={styles.icon} />
                Size
              </Link>
            </li>
            <li style={styles.listItem}>
              <Link style={styles.link} to="/color">
                <FontAwesomeIcon icon={faGear} style={styles.icon} />
                Color
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
                <FontAwesomeIcon icon={faPalette} style={styles.icon} />
                Setting
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/order" element={<Order />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category" element={<Category />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/size" element={<Size />} />
          <Route path="/color" element={<Color />} />
          <Route path="/user" element={<User />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </div>
    </Router>
  );
}

// Các kiểu CSS cho component
const styles = {
  container: {
    padding: 20,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
    height: '100vh',
  },
  heading: {
    color: 'red',
    fontSize: 24,
  },
  nav: {
    marginRight: 100,
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'gray',
    fontSize: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: 'gray',
    marginRight: 10,
  },
};
