import React, { useState } from "react";
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

// Component Brand
const Brand = () => <h2 style={styles.heading}>Brand</h2>;

export default function Navigation() {
  const [selected, setSelected] = useState("");

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <ul style={styles.list}>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "dashboard" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "dashboard" ? "red" : "gray",
              }}
              to="/dashboard"
              onClick={() => handleSelect("dashboard")}
            >
              <FontAwesomeIcon
                icon={faDashboard}
                style={{
                  ...styles.icon,
                  color: selected === "dashboard" ? "red" : "gray",
                }}
              />
              DashBoard
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "order" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "order" ? "red" : "gray",
              }}
              to="/order"
              onClick={() => handleSelect("order")}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{
                  ...styles.icon,
                  color: selected === "order" ? "red" : "gray",
                }}
              />
              Order
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "products" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "products" ? "red" : "gray",
              }}
              to="/products"
              onClick={() => handleSelect("products")}
            >
              <FontAwesomeIcon
                icon={faShirt}
                style={{
                  ...styles.icon,
                  color: selected === "products" ? "red" : "gray",
                }}
              />
              Products
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "category" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "category" ? "red" : "gray",
              }}
              to="/category"
              onClick={() => handleSelect("category")}
            >
              <FontAwesomeIcon
                icon={faThList}
                style={{
                  ...styles.icon,
                  color: selected === "category" ? "red" : "gray",
                }}
              />
              Category
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "brand" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "brand" ? "red" : "gray",
              }}
              to="/brand"
              onClick={() => handleSelect("brand")}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{
                  ...styles.icon,
                  color: selected === "brand" ? "red" : "gray",
                }}
              />
              Brand
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "user" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "user" ? "red" : "gray",
              }}
              to="/user"
              onClick={() => handleSelect("user")}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{
                  ...styles.icon,
                  color: selected === "user" ? "red" : "gray",
                }}
              />
              User
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "setting" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "setting" ? "red" : "gray",
              }}
              to="/setting"
              onClick={() => handleSelect("setting")}
            >
              <FontAwesomeIcon
                icon={faGear}
                style={{
                  ...styles.icon,
                  color: selected === "setting" ? "red" : "gray",
                }}
              />
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
    marginTop: "30px",
  },
  selectedItem: {
    border: "2px solid #E1E8FF",
    borderRadius: "10px",
    padding: "8px",
  },
  link: {
    textDecoration: "none",
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  content: {
    flex: 1, 
  },
};
