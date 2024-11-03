import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowProductsContainer from "../component/ShowProductsContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddSubCategoryModal from "../component/AddSubCategoryModal";
import AddMainCategoryModal from "../component/AddMainCategoryModal";
import AddChildCategoryModal from "../component/AddChildCategoryModal";
export default function ManageProducts() {
  //modal add category
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const openMainModal = () => setIsMainModalOpen(true);
  const closeMainModal = () => setIsMainModalOpen(false);
  
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const openSubModal = () => setIsSubModalOpen(true);
  const closeSubModal = () => setIsSubModalOpen(false);

  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const openChildModal = () => setIsChildModalOpen(true);
  const closeChildModal = () => setIsChildModalOpen(false);

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [product, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.51:5000/v1/api/category/get_categories/"
        );
        setMainCategories(response.data.metadata.categories);
      } catch (error) {
        console.error("Lỗi: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mainCategories.length > 0) {
      const parentId1 = mainCategories[0]._id;
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get(
            `http://192.168.1.51:5000/v1/api/category/get_categories/${parentId1}`
          );
          setSubCategories(response.data.metadata.categories);
        } catch (error) {
          console.error("Lỗi khi lấy sub categories: ", error);
        }
      };
      fetchSubCategories();
    }
  }, [mainCategories]);

  useEffect(() => {
    if (subCategories.length > 0) {
      const parentId2 = subCategories[0]._id;
      const fetchChildCategories = async () => {
        try {
          const response = await axios.get(
            `http://192.168.1.51:5000/v1/api/category/get_categories/${parentId2}`
          );
          setChildCategories(response.data.metadata.categories);
        } catch (error) {
          console.error("Lỗi khi lấy child categories: ", error);
        }
      };
      fetchChildCategories();
    }
  }, [subCategories]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSubCategories([]);
    setChildCategories([]);
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.51:5000/v1/api/category/get_categories/${category._id}`
        );
        setSubCategories(response.data.metadata.categories);
      } catch (error) {
        console.error("Lỗi khi lấy sub categories: ", error);
      }
    };
    fetchSubCategories();
  };

  const handleSubCategoryClick = (subCategory) => {
    if (!selectedCategory) {
      return;
    }
    setSelectedSubCategory(subCategory);
    setChildCategories([]);
    const fetchChildCategories = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.51:5000/v1/api/category/get_categories/${subCategory._id}`
        );
        setChildCategories(response.data.metadata.categories);
      } catch (error) {
        console.error("Lỗi khi lấy child categories: ", error);
      }
    };
    fetchChildCategories();
  };

  const handleChildCategoryClick = (childCategory) => {
    if (!selectedSubCategory) {
      return;
    }
    setSelectedChildCategory(childCategory);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://192.168.1.51:5000/v1/api/product/get_all_products"
        );

        const productsData = response.data?.metadata?.products || [];
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.warn("Dữ liệu sản phẩm không hợp lệ:", productsData);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, []);

  // Lọc sản phẩm theo category con đã chọn
  const filteredProducts = selectedChildCategory
    ? product.filter(
        (prod) => prod.name_category === selectedChildCategory.name_category
      )
    : [];

  return (
    <div>
      {/* Navigation Row 1 */}
      <div style={styles.navigationTop}>
        {mainCategories.map((category) => (
          <div
            key={category._id}
            style={
              selectedCategory?._id === category._id
                ? styles.selectedItem
                : styles.navigationItem
            }
            onClick={() => handleCategoryClick(category)}
          >
            {category.name_category}
          </div>
        ))}
        <button onClick={openMainModal} style={styles.addButton}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <AddMainCategoryModal
        isOpen={isMainModalOpen}
        style
        selectedCategory={selectedCategory} // Truyền danh mục đời 1 đã chọn
        onMainCategoryAdded={(newMainCategory) =>
          setMainCategories([...mainCategories, newMainCategory])
        }
        onRequestClose={closeMainModal}
      />
      {/* Navigation Row 2 */}
      <div style={styles.navigationBottom}>
        {subCategories.map((subCategory) => (
          <div
            key={subCategory._id}
            style={
              selectedSubCategory?._id === subCategory._id
                ? styles.selectedItem
                : styles.navigationItem
            }
            onClick={() => handleSubCategoryClick(subCategory)}
          >
            {subCategory.name_category}
            {/* <FontAwesomeIcon icon={faEdit} style={styles.icon} />
            <FontAwesomeIcon icon={faTrash} style={styles.icon} /> */}
          </div>
        ))}
        <button onClick={openSubModal} style={styles.addButton}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <AddSubCategoryModal
        isOpen={isSubModalOpen}
        style
        onRequestClose={closeSubModal}
        selectedCategory={selectedSubCategory} // Truyền danh mục đời 1 đã chọn
        onSubCategoryAdded={(newSubCategory) =>
          setSubCategories([...subCategories, newSubCategory])
        }
      />
      {/* Navigation Row 3 */}
      <div style={styles.navigationBottom}>
        {childCategories.map((childCategory) => (
          <div
            key={childCategory._id}
            style={
              selectedChildCategory?._id === childCategory._id
                ? styles.selectedItem
                : styles.navigationItem
            }
            onClick={() => handleChildCategoryClick(childCategory)}
          >
            {childCategory.name_category}
          </div>
        ))}
        <button onClick={openChildModal} style={styles.addButton}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <AddChildCategoryModal
        isOpen={isChildModalOpen}
        style
        onRequestClose={closeChildModal}
        selectedCategory={selectedChildCategory} // Truyền danh mục đời 1 đã chọn
        onChildCategoryAdded={(newChildCategory) =>
          setChildCategories([...childCategories, newChildCategory])
        }
      />

      {/* Render màn hình tương ứng */}
      <div style={styles.screen}>
        <div style={styles.containerShowProducts}>
          {/* Chỉ hiển thị sản phẩm nếu đã chọn category con */}
          {filteredProducts.map((prod) => (
            <ShowProductsContainer
              key={prod._id} // Sử dụng _id làm key
              image={prod.thumb}
              name={prod.name_product}
              price={prod.price_min} // Hiển thị giá tối thiểu
              quantity={prod.inventory_quantity}
              brand={prod.name_brand}
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
    padding: "10px",
    backgroundColor: "#f5f5f5",
  },
  navigationBottom: {
    display: "flex",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  screen: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
  },
  containerShowProducts: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: "20px",
    width: "70%",
  },
  icon: {
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
    color: "red",
  },
};
