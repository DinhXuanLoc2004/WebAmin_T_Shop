import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDashboard,
  faShirt,
  faShoppingCart,
  faThList,
  faRecycle,
  faTicket,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import DashBoard from "../Screen/DashBoard";
import ManageProducts from "../Screen/ManageProducts";
import ManageUser from "../Screen/ManageUser";
import Orders from "../Screen/Orders";
import ManageCategory from "../Screen/ManageCategory";
import ManageBrand from "../Screen/ManageBrand";
import RecycleBin from "../Screen/RecycleBin";
import SaleProducts from "../Screen/SaleProducts";
import Vouchers from "../Screen/Vouchers";
import Tshop from "../assets/images/Tshop.webp"

export default function Navigation() {
  const [selected, setSelected] = useState("");
  const handleSelect = (item) => {
    setSelected(item);
  };
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
      <div style={styles.logoContainer}>
    <img src={Tshop} alt="Tshop" style={styles.logo} />
  </div>
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
              ...(selected === "recycle" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "recycle" ? "red" : "gray",
              }}
              to="/recycle"
              onClick={() => handleSelect("recycle")}
            >
              <FontAwesomeIcon
                icon={faRecycle}
                style={{
                  ...styles.icon,
                  color: selected === "recycle" ? "red" : "gray",
                }}
              />
              Recycle Bin
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "sale" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "sale" ? "red" : "gray",
              }}
              to="/sale"
              onClick={() => handleSelect("sale")}
            >
              <FontAwesomeIcon
                icon={faTag}
                style={{
                  ...styles.icon,
                  color: selected === "sale" ? "red" : "gray",
                }}
              />
              Sale Product
            </Link>
          </li>
          <li
            style={{
              ...styles.listItem,
              ...(selected === "voucher" && styles.selectedItem),
            }}
          >
            <Link
              style={{
                ...styles.link,
                color: selected === "voucher" ? "red" : "gray",
              }}
              to="/voucher"
              onClick={() => handleSelect("voucher")}
            >
              <FontAwesomeIcon
                icon={faTicket}
                style={{
                  ...styles.icon,
                  color: selected === "voucher" ? "red" : "gray",
                }}
              />
              Vouchers
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
          <Route path="/brand" element={<ManageBrand />} />
          <Route path="/user" element={<ManageUser />} />
          <Route path="/recycle" element={<RecycleBin />} />
          <Route path="/sale" element={<SaleProducts />} />
          <Route path="/voucher" element={<Vouchers />} />
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
    position: "relative", // Make the container relative for positioning the sidebar
  },
  nav: {
    position: "fixed", // Make the navigation fixed
    top: 0,
    left: 0,
    width: "250px", // Set the width for the sidebar
    height: "100vh", // Make the sidebar take the full height
    padding: "20px", // Padding for the sidebar contents
    marginRight: 20,
    backgroundColor: "#f4f4f4", // Sidebar background color
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
    marginLeft: "230px", // Add a left margin to avoid overlap with the fixed sidebar
    padding: "20px", // Add padding for content
    height: "100vh",
    width: "100%",
    overflowY: "auto", // Allow scrolling in content area
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px", // Thêm khoảng cách dưới logo
  },
  logo: {
    width: "100px", // Kích thước logo
    height: "auto",
    borderRadius: "10px"
  },
  
};

