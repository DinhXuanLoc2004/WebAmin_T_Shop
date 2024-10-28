import React, { useState } from "react";
import ShowProductsContainer from "../component/ShowProductsContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
export default function ManageCategory() {
  // State để theo dõi mục được chọn
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Function xử lý khi click vào mục chính
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Function xử lý khi click vào sub-category
  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };
  const MenClothes = [
    {
      id: 1,
      name: "Tee",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantity: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "Pants",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
        quantity: 23,
      brand: "Balenciaga",
    },
  ];
  const MenShoes = [
    {
      id: 1,
      name: "giay nam",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
        quantity: 23,
        brand: "Balenciaga",
    },
    {
      id: 2,
      name: "giay nam",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
        quantity: 23,
      brand: "Balenciaga",
    },
  ];
  const MenAccessories = [
    {
      id: 1,
      name: "phu kien nam",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
        quantity: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "phu kien nam",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantity: 23,
      brand: "Balenciaga",
    },
    {
        id: 3,
        name: "phu kien nam",
        price: 50,
        image:
          "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
        quantity: 23,
        brand: "Balenciaga",
      },
      {
        id: 4,
        name: "phu kien nam",
        price: 50,
        image:
          "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
        quantity: 23,
        brand: "Balenciaga",
      },
      {
        id: 5,
        name: "phu kien nam",
        price: 50,
        image:
          "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
        quantity: 23,
        brand: "Balenciaga",
      },
      {
        id: 6,
        name: "phu kien nam",
        price: 50,
        image:
          "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
        quantity: 23,
        brand: "Balenciaga",
      },
      {
        id: 7,
        name: "phu kien nam",
        price: 50,
        image:
          "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
        quantity: 23,
        brand: "Balenciaga",
      },
  ];
  const WoMenClothes = [
    {
      id: 1,
      name: "Tee nứ",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
        quantity: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "Pants nữ",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantity: 23,
      brand: "Balenciaga",
    },
  ];
  const WoMenShoes = [
    {
      id: 1,
      name: "giay nữ",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
      quantity: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "giay nữ",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantity: 23,
      brand: "Balenciaga",
    },
  ];
  const WoMenAccessories = [
    {
      id: 1,
      name: "phu kien nữ",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
      quantity: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "phu kien nữ",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantity: 23,
      brand: "Balenciaga",
    },
  ];
  const kidClothes = [
    {
      id: 1,
      name: "Tee nít",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
      quantity: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "Pants nít",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantity: 23,
      brand: "Balenciaga",
    },
  ];
  const kidShoes = [
    {
      id: 1,
      name: "giay nít",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
      quantiy: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "giay nít",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantiy: 23,
      brand: "Balenciaga",
    },
  ];
  const kidAccessories = [
    {
      id: 1,
      name: "phu kien nít",
      price: 20,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1", // Thay bằng URL ảnh thực tế
      quantiy: 23,
      brand: "Balenciaga",
    },
    {
      id: 2,
      name: "phu kien nít",
      price: 50,
      image:
        "https://balenciaga.dam.kering.com/m/2158263d98d4979/Small-783399TQVS81083_Y.jpg?v=1",
      quantiy: 23,
      brand: "Balenciaga",
    },
  ];

  // Hàm chọn sản phẩm dựa trên category và subcategory
  const getProducts = () => {
    if (selectedCategory === "Men") {
      if (selectedSubCategory === "Clothes") {
        return MenClothes;
      } else if (selectedSubCategory === "Shoes") {
        return MenShoes;
      } else if (selectedSubCategory === "Accessories") {
        return MenAccessories;
      }
    } else if (selectedCategory === "Women") {
      if (selectedSubCategory === "Clothes") {
        return WoMenClothes;
      } else if (selectedSubCategory === "Shoes") {
        return WoMenShoes;
      } else if (selectedSubCategory === "Accessories") {
        return WoMenAccessories;
      }
    } else if (selectedCategory === "Kids") {
      if (selectedSubCategory === "Clothes") {
        return kidClothes;
      } else if (selectedSubCategory === "Shoes") {
        return kidShoes;
      } else if (selectedSubCategory === "Accessories") {
        return kidAccessories;
      }
    }
    return [];
  };
  return (
    <div>
      <div style={styles.navigationTop}>
        <div
          style={
            selectedCategory === "Men"
              ? styles.selectedItem
              : styles.navigationItem
          }
          onClick={() => handleCategoryClick("Men")}
        >
          Men
        </div>
        <div
          style={
            selectedCategory === "Women"
              ? styles.selectedItem
              : styles.navigationItem
          }
          onClick={() => handleCategoryClick("Women")}
        >
          Women
        </div>
        <div
          style={
            selectedCategory === "Kids"
              ? styles.selectedItem
              : styles.navigationItem
          }
          onClick={() => handleCategoryClick("Kids")}
        >
          Kids
        </div>
        <FontAwesomeIcon icon={faPlus} style={styles.addButton} />
      </div>

      {/* Navigation Row 2 */}
      <div style={styles.navigationBottom}>
        <div
          style={
            selectedSubCategory === "Clothes"
              ? styles.selectedItem
              : styles.navigationItem
          }
          onClick={() => handleSubCategoryClick("Clothes")}
        >
          Clothes
          <FontAwesomeIcon icon={faEdit} style={styles.icon} />
          <FontAwesomeIcon icon={faTrash} style={styles.icon} />
        </div>
        <div
          style={
            selectedSubCategory === "Shoes"
              ? styles.selectedItem
              : styles.navigationItem
          }
          onClick={() => handleSubCategoryClick("Shoes")}
        >
          Shoes
          <FontAwesomeIcon icon={faEdit} style={styles.icon} />
          <FontAwesomeIcon icon={faTrash} style={styles.icon} />
        </div>
        <div
          style={
            selectedSubCategory === "Accessories"
              ? styles.selectedItem
              : styles.navigationItem
          }
          onClick={() => handleSubCategoryClick("Accessories")}
        >
          Accessories
          <FontAwesomeIcon icon={faEdit} style={styles.icon} />
          <FontAwesomeIcon icon={faTrash} style={styles.icon} />
        </div>
      </div>

      {/* Render màn hình tương ứng */}
      <div style={styles.screen}>
        <div style={styles.containerShowProducts}>
          {getProducts().map((product) => (
            <ShowProductsContainer
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
              brand={product.brand}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
const styles = {
  navigationTop: {
    display: "flex",
    // justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f5f5f5",
  },
  navigationBottom: {
    display: "flex",
    // justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderTop: "2px solid red",
    marginTop: "10px",
  },
  navigationItem: {
    fontSize: "16px",
    marginRight: "20px",
    cursor: "pointer",
  },
  selectedItem: {
    fontSize: "16px",
    marginRight: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "blue",
  },
  addButton: {
    backgroundColor: "#00FF38",
    color: "white",
    border: "none",
    borderRadius: "20%",
    width: "30px",
    height: "30px",
  },
  screen: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
  },
  containerShowProducts: {
    display: "flex",
    flexWrap: "wrap", // Để các item tự động xuống dòng khi không đủ chỗ
    justifyContent: "space-around", // Để căn giữa các item
    gap: "20px", // Khoảng cách giữa các item
    width: "70%", //
  },
  icon: {
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
    color: "red",
  },
};
