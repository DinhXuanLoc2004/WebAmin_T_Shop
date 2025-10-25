import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowProductsContainer from "../component/ShowProductsContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddSubCategoryModal from "../component/AddSubCategoryModal";
import AddMainCategoryModal from "../component/AddMainCategoryModal";
import AddChildCategoryModal from "../component/AddChildCategoryModal";
import debounce from "lodash.debounce";

export default function ManageCategory() {
  //eidt
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [nameCategory, setNameCategory] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/v1/api/category/get_categories?is_delete=false"
        );
        setMainCategories(response.data.metadata.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Open and close the update modalmon
  const openUpdateModal = (category) => {
    setCategoryToUpdate(category);
    setNameCategory(category.name_category);
    setParentId(category.parent_id || "");
    setImage(category.image || "");
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCategoryToUpdate(null);
  };
  const handleUpdateCategory = async () => {
    try {
      const formData = new FormData();
      // Thêm các trường dữ liệu vào FormData
      formData.append("name_category", nameCategory);
      if (parentId) {
        formData.append("parent_id", parentId);
      }

      // Kiểm tra nếu `image` là file, thêm nó vào FormData
      if (image instanceof File) {
        formData.append("image", image);
      }

      // Gửi request bằng Axios
      await axios.put(
        `http://localhost:5000/v1/api/category/update_category?_id=${categoryToUpdate._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cập nhật danh sách danh mục
      setMainCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryToUpdate._id
            ? { ...cat, name_category: nameCategory, parent_id: parentId }
            : cat
        )
      );

      closeUpdateModal();
    } catch (error) {
      console.error("Error updating category", error);
    }
  };

  //delete
  const handleDeleteCategory = async (_id) => {
    try {
      console.log("ID cần xóa:", _id); // Kiểm tra giá trị id_category
      await axios.delete(
        `http://localhost:5000/v1/api/category/toggle_delete_category`,
        {
          params: { _id },
        }
      );

      // Cập nhật lại danh sách sau khi xóa
      setMainCategories(
        mainCategories.filter((category) => category._id !== _id)
      );
      setSubCategories(
        subCategories.filter((category) => category._id !== _id)
      );
      setChildCategories(
        childCategories.filter((category) => category._id !== _id)
      );

      console.log("Xóa danh mục thành công");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  //modal add category
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const openMainModal = () => setIsMainModalOpen(true);
  const closeMainModal = () => {
    setIsMainModalOpen(false);
  };
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

  // Fetch Main Categories
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/v1/api/category/get_categories?is_delete=false"
        );
        setMainCategories(response.data.metadata.categories || []);
      } catch (error) {
        console.error("Lỗi khi lấy main categories: ", error);
      }
    };

    const interval = setInterval(() => {
      fetchMainCategories();
    }, 1000); // Cập nhật mỗi 5 giây

    // Dọn dẹp interval khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  // Fetch Sub Categories khi Main Categories thay đổi
  // Tự động tải danh mục con khi danh mục cha thay đổi
  useEffect(() => {
    if (!selectedCategory?._id) {
      setSubCategories([]); // Xóa subcategories nếu không có danh mục cha
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/v1/api/category/get_categories?parent_id=${selectedCategory._id}&is_delete=false`
        );
        setSubCategories(response.data.metadata.categories || []);
      } catch (error) {
        console.error("Lỗi khi lấy sub categories: ", error);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  // Tự động tải danh mục cháu khi danh mục con thay đổi
  useEffect(() => {
    if (!selectedSubCategory?._id) {
      setChildCategories([]); // Xóa childCategories nếu không có danh mục con
      return;
    }

    const fetchChildCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/v1/api/category/get_categories?parent_id=${selectedSubCategory._id}&is_delete=false`
        );
        setChildCategories(response.data.metadata.categories || []);
      } catch (error) {
        console.error("Lỗi khi lấy child categories: ", error);
      }
    };

    fetchChildCategories();
  }, [selectedSubCategory]);

  // Hàm xử lý khi click vào danh mục cha
  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Chọn danh mục cha
    setSelectedSubCategory(null); // Reset danh mục con
    setSelectedChildCategory(null); // Reset danh mục cháu
  };

  // Hàm xử lý khi click vào danh mục con
  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory); // Chọn danh mục con
    setSelectedChildCategory(null); // Reset danh mục cháu
  };

  // Hàm xử lý khi click vào danh mục cháu
  const handleChildCategoryClick = (childCategory) => {
    setSelectedChildCategory(childCategory); // Chọn danh mục cháu
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/v1/api/product/get_all_products"
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
            className={selectedCategory?._id === category._id ? "active" : ""}
            style={
              selectedCategory?._id === category._id
                ? styles.selectedItem
                : styles.navigationItem
            }
            onClick={() => handleCategoryClick(category)}
          >
              <span style={{ fontSize: 20, fontFamily: "initial" }}>
              {category.name_category}
            </span>

            <FontAwesomeIcon
              icon={faEdit}
              style={styles.icon}
              onClick={() => openUpdateModal(category)}
            />
            {category.can_be_delete && (
              <FontAwesomeIcon
                icon={faTrash}
                style={styles.icon}
                onClick={() => handleDeleteCategory(category._id)}
              />
            )}
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
      {selectedCategory && (
        <div style={styles.navigationBottom}>
          {subCategories.map((subCategory) => (
            <div
              key={subCategory._id}
              className={
                selectedSubCategory?._id === subCategory._id ? "active" : ""
              }
              style={
                selectedSubCategory?._id === subCategory._id
                  ? styles.selectedItem
                  : styles.navigationItem
              }
              onClick={() => handleSubCategoryClick(subCategory)}
            >
               <span style={{ fontSize: 20, fontFamily: "initial" }}>
              {subCategory.name_category}
            </span>

              <FontAwesomeIcon
                icon={faEdit}
                style={styles.icon}
                onClick={() => openUpdateModal(subCategory)}
              />
              {subCategory.can_be_delete && (
                <FontAwesomeIcon
                  icon={faTrash}
                  style={styles.icon}
                  onClick={() => handleDeleteCategory(subCategory._id)}
                />
              )}
            </div>
          ))}
          <button onClick={openSubModal} style={styles.addButton}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}
      <AddSubCategoryModal
        isOpen={isSubModalOpen}
        style
        onRequestClose={closeSubModal}
        selectedCategory={selectedCategory}
        onSubCategoryAdded={(newSubCategory) => {
          setSubCategories([...subCategories, newSubCategory]);
        }}
      />

      {/* Navigation Row 3 */}
      <div style={styles.navigationBottom}>
        {childCategories.map((childCategory) => (
          <div
            key={childCategory._id}
            className={
              selectedChildCategory?._id === childCategory._id ? "active" : ""
            }
            style={
              selectedChildCategory?._id === childCategory._id
                ? styles.selectedItem
                : styles.navigationItem
            }
            onClick={() => handleChildCategoryClick(childCategory)}
          >
            <span style={{ fontSize: 20, fontFamily: "initial" }}>
              {childCategory.name_category}
            </span>

            <FontAwesomeIcon
              icon={faEdit}
              style={styles.icon}
              onClick={() => openUpdateModal(childCategory)}
            />
            {childCategory.can_be_delete && (
              <FontAwesomeIcon
                icon={faTrash}
                style={styles.icon}
                onClick={() => handleDeleteCategory(childCategory._id)}
              />
            )}
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
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        onChildCategoryAdded={(newChildCategory) => {
          setChildCategories((prevCategories) => [
            ...prevCategories,
            newChildCategory,
          ]); // Cập nhật ngay danh sách
        }}
      />
      {isUpdateModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Update Category</h3>

            {/* Trường nhập Name */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                value={nameCategory}
                onChange={(e) => setNameCategory(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Trường chọn Parent ID */}
            {/* Trường chọn Parent ID chỉ hiển thị nếu depth < 2 */}
            {categoryToUpdate.depth < 2 && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Parent Category:</label>
                <select
                  value={parentId || ""}
                  onChange={(e) => setParentId(e.target.value)}
                  style={styles.select}
                >
                  <option value="">No Parent</option>
                  {mainCategories
                    .filter(
                      (cat) =>
                        cat.depth === categoryToUpdate.depth - 1 &&
                        !cat.is_delete // Bỏ qua danh mục đã bị xóa
                    )
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name_category}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Chọn ảnh */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                }}
                style={styles.fileInput}
              />
            </div>

            {/* Xem trước ảnh */}
            {image && (
              <div style={styles.previewContainer}>
                <p style={styles.previewText}>Selected Image:</p>
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Preview"
                  style={styles.previewImage}
                />
              </div>
            )}

            {/* Nút hành động */}
            <div style={styles.buttonGroup}>
              <button
                style={styles.updateButton}
                onClick={handleUpdateCategory}
              >
                Update
              </button>
              <button style={styles.cancelButton} onClick={closeUpdateModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  navigationTop: {
    display: "flex",
    flexWrap: "wrap", // Cho phép xuống dòng khi không đủ chỗ
    gap: "10px", // Khoảng cách giữa các item
    padding: "15px",
    background: "linear-gradient(to right, #f9f9f9, #e0e0e0)", // Gradient nhẹ
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ
  },
  navigationBottom: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    padding: "15px",
    background: "linear-gradient(to right, #f9f9f9, #e0e0e0)",
    borderRadius: "8px",
    marginTop: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  navigationItem: {
    padding: "10px 15px", // Thêm khoảng cách bên trong
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    alignItems: "center", // Căn giữa biểu tượng và text
    justifyContent: "space-between",
  },
  selectedItem: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#007BFF",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  addButtonHover: {
    transform: "scale(1.1)", // Hiệu ứng khi hover
  },
  screen: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
  },
  containerShowProducts: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "20px",
    width: "1000px",
  },
  icon: {
    cursor: "pointer",
    fontSize: "18px",
    marginLeft: "10px",
    color: "#dc3545",
    transition: "color 0.2s ease",
  },
  iconHover: {
    color: "#a71d2a",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    animation: "fadeIn 0.3s ease-in-out",
  },
  modalTitle: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#007BFF",
  },
  fileInput: {
    border: "none",
  },
  previewContainer: {
    margin: "15px 0",
    textAlign: "center",
  },
  previewText: {
    marginBottom: "10px",
    fontSize: "14px",
    color: "#555",
  },
  previewImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  updateButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
};
