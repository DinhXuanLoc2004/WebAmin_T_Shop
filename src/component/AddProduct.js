import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../Css/Dialog.css";
import "../Css/Spinner.css";
import axios from "axios";
import { Modal, Button, Row, Col } from "react-bootstrap";

const AddProduct = ({ onProductAdded }) => {
  const [errors, setErrors] = useState({
    name_product: "",
    description: "",
    category_id: "",
    brand_id: "",
    is_public: "",
    product_variants: "",
    images: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name_product: "",
    description: "",
    images: [],
    category_id: "",
    brand_id: "",
    product_variants: [],
    is_public: "true",
  });
  const [imagesPreview, setImagesPreview] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [colorId, setColorId] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageProductColors, setImageProductColors] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [editedCategoryName, setEditedCategoryName] = useState(""); // Tên đã chỉnh sửa

  useEffect(() => {
    fetchCategories(null, setCategories);
  }, []);

  const fetchCategories = async (parentId, setData) => {
    try {
      const response = await axios.get(
        `https://backenddatn-production.up.railway.app/v1/api/category/get_categories`,
        {
          params: {
            is_delete: false,
            parent_id: parentId,
          },
        }
      );
      setData(response.data.metadata.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSubCategories([]);
    setChildCategories([]);
    setSelectedSubCategory(null);
    fetchCategories(category._id, setSubCategories);
    setErrors((prev) => ({ ...prev, category_id: "" }));
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setChildCategories([]);
    fetchCategories(subCategory._id, setChildCategories);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const addCategory = () => {
    if (selectedCategoryToAdd) {
      setEditedCategoryName(selectedCategoryToAdd.name_category);
      setNewProductData({
        ...newProductData,
        category_id: selectedCategoryToAdd._id,
      });
      setIsEditing(true);
    }
    setIsModalVisible(false);
  };

  const handleInputClick = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colorRes = await axios.get(
          "https://backenddatn-production.up.railway.app/v1/api/color/get_all_colors"
        );
        setColors(colorRes.data.metadata || []);

        const brandRes = await axios.get(
          "https://backenddatn-production.up.railway.app/v1/api/brand/get_all_brands"
        );
        setBrands(brandRes.data.metadata || []);

        const sizeRes = await axios.get(
          "https://backenddatn-production.up.railway.app/v1/api/size/get_all_sizes"
        );
        setSizes(sizeRes.data.metadata || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const openAddProductModal = () => {
    setIsAddProductOpen(true);
  };

  const closeAddProductModal = () => {
    setIsAddProductOpen(false);
    setNewProductData({
      name_product: "",
      description: "",
      images: [],
      category_id: "",
      brand_id: "",
      product_variants: [],
    });
  };

  const handleAddProduct = async () => {
    setIsLoading1(true);
    let valid = true;
    const newErrors = {
      name_product: "",
      description: "",
      category_id: "",
      brand_id: "",
      is_public: "",
      product_variants: "",
      images: "",
    };

    // Kiểm tra dữ liệu nhập vào và gán lỗi nếu không hợp lệ
    if (!newProductData.name_product.trim()) {
      valid = false;
      newErrors.name_product = "Please enter the product name.";
    }

    if (!newProductData.description.trim()) {
      valid = false;
      newErrors.description = "Please enter the description.";
    }

    if (!newProductData.category_id) {
      valid = false;
      newErrors.category_id = "Please select a category.";
    }

    if (!newProductData.brand_id) {
      valid = false;
      newErrors.brand_id = "Please select a brand.";
    }

    if (!newProductData.product_variants.length) {
      valid = false;
      newErrors.product_variants = "Please add at least one product variant.";
    } else {
      const seenVariants = new Set(); // Sử dụng Set để lưu các cặp giá trị duy nhất

      newProductData.product_variants.forEach((variant, index) => {
        if (!variant.quantity) {
          valid = false;
          newErrors[`product_variants[${index}].quantity`] =
            "Please enter the quantity.";
        }
        if (!variant.price) {
          valid = false;
          newErrors[`product_variants[${index}].price`] = "Please enter the price.";
        }
        if (!variant.size_id) {
          valid = false;
          newErrors[`product_variants[${index}].size_id`] =
            "Please select a size.";
        }
        if (!variant.image_product_color_id) {
          valid = false;
          newErrors[`product_variants[${index}].image_product_color_id`] =
            "Please enter the product color ID.";
        }

        const seenVariants = new Set();
        newProductData.product_variants.forEach((variant, index) => {
          const key = `${variant.size_id}-${variant.image_product_color_id}`;
          if (seenVariants.has(key)) {
            valid = false;
            newErrors[`product_variants[${index}].duplicate`] =
              "Duplicate size and color combination detected.";
          } else {
            seenVariants.add(key);
          }
        });
      });
    }

    // Nếu có lỗi, cập nhật lỗi và dừng xử lý
    if (!valid) {
      console.log("Errors:", newErrors);
      setErrors(newErrors); // Cập nhật lỗi cho từng trường
      setIsLoading1(false);
      return;
    }

    // Xóa lỗi nếu tất cả dữ liệu hợp lệ
    setErrors({}); // Reset lỗi

    // Tiếp tục thực hiện logic gửi dữ liệu
    try {
      const formData = new FormData();
      formData.append("name_product", newProductData.name_product);
      formData.append("description", newProductData.description);
      formData.append("category_id", newProductData.category_id);
      formData.append("brand_id", newProductData.brand_id);
      formData.append("is_public", newProductData.is_public);
      formData.append(
        "product_variants",
        JSON.stringify(newProductData.product_variants)
      );

      for (let index = 0; index < newProductData.images.length; index++) {
        const file = newProductData.images[index];
        formData.append("images", file);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await axios.post(
        "https://backenddatn-production.up.railway.app/v1/api/product/add_product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      closeAddProductModal();

      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsLoading1(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewProductData({
      ...newProductData,
      images: [...newProductData.images, ...newImages.map((img) => img.file)],
    });

    setImagesPreview((prevPreviews) => [...prevPreviews, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = imagesPreview.filter((_, i) => i !== index);
    const updatedFiles = newProductData.images.filter((_, i) => i !== index);

    setImagesPreview(updatedImages);
    setNewProductData({
      ...newProductData,
      images: updatedFiles,
    });
  };

  const handleAddVariant = () => {
    setErrors((prev) => ({ ...prev, product_variants: "" }));
    setNewProductData({
      ...newProductData,
      product_variants: [
        ...newProductData.product_variants,
        {
          quantity: "",
          price: "",
          size_id: "",
          image_product_color_id: "",
        },
      ],
    });
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = newProductData.product_variants.filter(
      (variant, i) => i !== index
    );
    setNewProductData({
      ...newProductData,
      product_variants: updatedVariants,
    });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...newProductData.product_variants];
    if (field === "quantity" || field === "price") {
      value = value === "" || value > 0 ? value : newVariants[index][field];
    }

    if (field === "image_product_color_id" && value === "last_added") {
      value = imageProductColors[imageProductColors.length - 1];
    }

    newVariants[index][field] = value;

    setNewProductData({
      ...newProductData,
      product_variants: newVariants,
    });

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[`product_variants[${index}].${field}`];
      return updatedErrors;
    });
  };

  const handleAddImageProductColor = async () => {
    setIsLoading(true);
    if (!uploadedImage || !colorId) {
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadedImage);
    formData.append("color_id", colorId);

    try {
      const response = await axios.post(
        "http://localhost:5000/v1/api/image_product_color/add_image_product_color",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newImageColor = response.data.metadata.newImageProductColor;
      console.log(response.data.metadata.newImageProductColor);
      setImageProductColors([...imageProductColors, newImageColor._id]);
    } catch (error) {
      console.error("Error adding image product color:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button style={styles.addBtn} onClick={openAddProductModal}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} /> Add
        Product
      </button>

      <Modal
        show={isAddProductOpen}
        onHide={closeAddProductModal}
        centered
        style={isModalVisible ? { opacity: 0.5 } : {}}
      >
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody1}>
          <form>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name:</label>
              <input
                type="text"
                value={newProductData.name_product}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewProductData({
                    ...newProductData,
                    name_product: value,
                  });
                  if (value.trim()) {
                    setErrors((prev) => ({ ...prev, name_product: "" }));
                  }
                }}
                style={styles.input}
              />
              {errors.name_product && (
                <p style={styles.errorText}>{errors.name_product}</p>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description:</label>
              <textarea
                value={newProductData.description}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewProductData({
                    ...newProductData,
                    description: value,
                  });
                  if (value.trim()) {
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }
                }}
                style={styles.textarea}
              />
              {errors.description && (
                <p style={styles.errorText}>{errors.description}</p>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category:</label>
              <div style={styles.buttonContainer}>
                <input
                  type="text"
                  value={editedCategoryName || "Select Category"}
                  onClick={handleInputClick}
                  readOnly
                  style={styles.input}
                />
                {errors.category_id && (
                  <p style={styles.errorText}>{errors.category_id}</p>
                )}
              </div>

              <Modal
                style={{ alignContent: "center" }}
                show={isModalVisible}
                onHide={toggleModal}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Select category</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex" }}>
                  <div style={styles.menu}>
                    <Row>
                      {categories.map((category) => (
                        <Col key={category._id} style={styles.col}>
                          <Button
                            variant="light"
                            block
                            onClick={() => handleCategorySelect(category)}
                            style={{
                              backgroundColor: "white",
                              border: "none",
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              ...(selectedCategory?._id === category._id
                                ? styles.activeItem
                                : {}),
                            }}
                          >
                            <span>{category.name_category}</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {selectedCategory && (
                    <div style={styles.menu}>
                      <Row style={styles.row}>
                        {subCategories.map((subCategory) => (
                          <Col key={subCategory._id} style={styles.col}>
                            <did style={styles.ButtonIcon}>
                              <Button
                                variant="light"
                                block
                                onClick={() =>
                                  handleSubCategorySelect(subCategory)
                                }
                                style={{
                                  backgroundColor: "white",
                                  border: "none",
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  ...(selectedSubCategory?._id ===
                                  subCategory._id
                                    ? styles.activeItem
                                    : {}),
                                }}
                              >
                                {subCategory.name_category}
                                <FontAwesomeIcon icon={faChevronRight} />
                              </Button>
                            </did>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {selectedSubCategory && (
                    <div style={styles.menu}>
                      <Row style={styles.row}>
                        {childCategories.map((childCategory) => (
                          <Col key={childCategory._id} style={styles.col}>
                            <Button
                              variant="light"
                              block
                              onClick={() =>
                                setSelectedCategoryToAdd(childCategory)
                              }
                              style={{
                                backgroundColor: "white",
                                border: "none",
                                ...(selectedCategoryToAdd?._id ===
                                childCategory._id
                                  ? styles.activeItem
                                  : {}),
                              }}
                            >
                              {childCategory.name_category}
                            </Button>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={toggleModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={addCategory}>
                    Add
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Brand:</label>
              <select
                value={newProductData.brand_id}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewProductData({
                    ...newProductData,
                    brand_id: e.target.value,
                  });
                  if (value) {
                    setErrors((prev) => ({ ...prev, brand_id: "" }));
                  }
                }}
                style={styles.select}
              >
                <option value="" disabled>
                  Select Brand
                </option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name_brand}
                  </option>
                ))}
              </select>
              {errors.brand_id && (
                <p style={styles.errorText}>{errors.brand_id}</p>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Images:</label>
              <div style={styles.imageGrid}>
                {imagesPreview.map((image, index) => (
                  <div key={index} style={styles.imageContainer}>
                    <img
                      src={image.preview}
                      alt="Preview"
                      style={styles.imagePreview}
                    />
                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
                <label style={styles.addImageBox}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={styles.inputFile}
                    onChange={handleImageUpload}
                  />
                  <span style={styles.addIcon}>+</span>
                </label>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Public Product:</label>
                <select
                  value={newProductData.is_public}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      is_public: e.target.value === "false",
                    })
                  }
                  style={styles.select}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Product Variants:</label>
              <div style={styles.variantContainer}>
                {newProductData.product_variants.map((variant, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <select
                      value={variant.size_id}
                      onChange={(e) =>
                        handleVariantChange(index, "size_id", e.target.value)
                      }
                      style={styles.select}
                    >
                      <option value="" disabled>
                        Select Size
                      </option>
                      {sizes.map((size) => (
                        <option key={size._id} value={size._id}>
                          {size.size}
                        </option>
                      ))}
                    </select>
                    {errors[`product_variants[${index}].size_id`] && (
                      <p style={styles.errorText}>
                        {errors[`product_variants[${index}].size_id`]}
                      </p>
                    )}
                    {errors[`product_variants[${index}].duplicate`] && (
                      <p style={styles.errorText}>
                        {errors[`product_variants[${index}].duplicate`]}
                      </p>
                    )}
                    <div
                      style={{
                        background: "#EEEEEE",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Image Color ID"
                        value={variant.image_product_color_id}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "image_product_color_id",
                            e.target.value
                          )
                        }
                        style={styles.input}
                      />
                      {errors[`product_variants[${index}].image_product_color_id`] && (
                        <p style={styles.errorText}>
                          {errors[`product_variants[${index}].image_product_color_id`]}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleVariantChange(
                            index,
                            "image_product_color_id",
                            "last_added"
                          )
                        }
                        style={styles.buttonAddVariant}
                      >
                        Add Image Color ID
                      </button>

                      <hr />

                      <div style={styles.formGroup}>
                        <select
                          value={colorId}
                          onChange={(e) => setColorId(e.target.value)}
                          style={styles.select}
                        >
                          <option value="" disabled>
                            Select Color
                          </option>
                          {colors.map((color) => (
                            <option key={color._id} value={color._id}>
                              {color.name_color}
                            </option>
                          ))}
                        </select>

                        <div style={styles.imageGrid}>
                          {uploadedImage && (
                            <div style={styles.imageContainer}>
                              <img
                                src={URL.createObjectURL(uploadedImage)}
                                alt="Preview"
                                style={styles.imagePreview}
                              />
                              <button
                                style={styles.removeButton}
                                onClick={() => setUploadedImage(null)}
                              >
                                X
                              </button>
                            </div>
                          )}

                          {!uploadedImage && (
                            <label style={styles.addImageBox}>
                              <input
                                type="file"
                                accept="image/*"
                                style={styles.inputFile}
                                onChange={(e) =>
                                  setUploadedImage(e.target.files[0])
                                }
                              />
                              <span style={styles.addIcon}>+</span>
                            </label>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleAddImageProductColor}
                          style={styles.buttonAddVariant}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="spinner"></div>
                          ) : (
                            "Add Image Product Color"
                          )}
                        </button>
                      </div>
                    </div>

                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={variant.quantity}
                      onChange={(e) =>
                        handleVariantChange(index, "quantity", e.target.value)
                      }
                      style={styles.input}
                      min="1"
                    />
                    {errors[`product_variants[${index}].quantity`] && (
                      <p style={styles.errorText}>
                        {errors[`product_variants[${index}].quantity`]}
                      </p>
                    )}

                    <input
                      type="text"
                      placeholder="Enter price"
                      value={
                        variant.price
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(variant.price)
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^\d]/g, "");
                        handleVariantChange(
                          index,
                          "price",
                          rawValue ? parseInt(rawValue, 10) : ""
                        );
                      }}
                      style={styles.input}
                    />
                    {errors[`product_variants[${index}].price`] && (
                      <p style={styles.errorText}>
                        {errors[`product_variants[${index}].price`]}
                      </p>
                    )}

                    <div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        style={styles.buttonRemoveVariant}
                      >
                        Remove Variant
                      </button>

                      <hr style={{ border: "1px solid black" }} />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddVariant}
                  style={styles.buttonAddVariant}
                >
                  Add Variant
                </button>
                {errors.product_variants && (
                  <p style={styles.errorText}>{errors.product_variants}</p>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <button
            onClick={handleAddProduct}
            style={styles.button}
            disabled={isLoading1}
          >
            {isLoading1 ? <div className="spinner"></div> : "Save"}
          </button>

          <button
            onClick={closeAddProductModal}
            style={{ ...styles.button, ...styles.buttonCancel }}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;

const styles = {
  imageGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  imageContainer: {
    position: "relative",
    width: "100px",
    height: "100px",
  },
  removeButton: {
    position: "absolute",
    top: "0px",
    right: "0px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    fontSize: "12px",
  },
  addImageBox: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    cursor: "pointer",
  },
  addIcon: {
    fontSize: "24px",
    color: "#aaa",
  },

  modalHeader: {
    borderBottom: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f8f9fa",
  },
  buttonCancel: {
    backgroundColor: "#6c757d",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
  },
  buttonAddVariant: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "8px 16px",
    marginTop: "10px",
    border: "none",
    borderRadius: "5px",
  },
  buttonRemoveVariant: {
    backgroundColor: "red",
    color: "#fff",
    padding: "8px 16px",
    marginTop: "10px",
    border: "none",
    borderRadius: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
  variantContainer: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },
  formGroup: {
    marginTop: "10px",
  },
  inputFile: {
    padding: "5px",
    display: "none",
  },
  imagePreview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  modalBody1: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  addBtn: {
    position: "absolute",
    right: "80px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    marginTop: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "100px",
  },
  menu: {
    width: "33%",
    marginBottom: "20px",
  },
  buttonContainer: {
    marginBottom: "20px",
  },
  col: {
    marginRight: "10px",
    flex: "1 1 auto",
    minWidth: "100px",
  },
  activeItem: {
    color: "red",
    backgroundColor: "white",
    border: "none",
  },
  ButtonIcon: {
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: "12px",
    textAlign: "center",
  },
};
