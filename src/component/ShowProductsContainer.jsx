import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const ShowProductsContainer = ({ image, name, price, quantity, brand }) => {
  return (
    <div style={styles.container}>
      <img src={image} style={styles.image} />
      <text style={styles.name}>{name}</text>
      <text style={styles.brand}>{brand} </text>
      <div
        style={{
          flexDirection: "row",
          marginTop: 10,
          alignItems: "center",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <text style={{ ...styles.price, marginRight: 10 }}>${price}</text>
        <text style={styles.quantity}>{quantity} items</text>
      </div>

      <div style={{ flexDirection: "row", marginTop: 10 }}>
        <FontAwesomeIcon icon={faEdit} style={styles.icon} />
        <FontAwesomeIcon icon={faTrash} style={styles.icon} />
      </div>
    </div>
  );
};
const styles = {
  container: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: 150,
    height: 150,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 16,
    fontWeight: 500,
  },
  quantity: {
    fontSize: 14,
    color: "#888",
  },
  price: {
    fontSize: 14,
    color: "black",
    fontWeight:500
  },
  icon: {
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
    color: "red",
  },
};
export default ShowProductsContainer;
