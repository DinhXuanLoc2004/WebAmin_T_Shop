import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../Css/Spinner.css";

export default function EditProduct({ productId, onProductUpdated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [formData, setFormData] = useState({
    name_product: "",
    description: "",
    category_id: "",
    brand_id: "",
    images: [],
    product_variants: [],
    is_public: "true",
  });
  const [errors, setErrors] = useState({
    product_variants: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [colors, setColors] = useState([]);
  const [colorId, setColorId] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageProductColors, setImageProductColors] = useState([]);

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
      setFormData({
        ...formData,
        category_id: selectedCategoryToAdd._id,
      });
    }
    setIsModalVisible(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // Log giá trị của formData.images trước khi cập nhật
    console.log("FormData Images Before Update:", formData.images);

    const updatedImages = [...formData.images, ...newImages];

    // Log cả giá trị mới và cũ của formData.images
    console.log("Images After Adding New:", updatedImages);

    setFormData((prevState) => {
      // Log lại formData sau khi cập nhật để xem sự thay đổi
      console.log("FormData After Update:", {
        ...prevState,
        images: updatedImages,
      });
      return {
        ...prevState,
        images: updatedImages,
      };
    });

    // Cập nhật preview images
    setImagesPreview((prevPreviews) => [...prevPreviews, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = imagesPreview.filter((_, i) => i !== index);
    const updatedFiles = formData.images.filter((_, i) => i !== index);

    setImagesPreview(updatedImages);
    setFormData({
      ...formData,
      images: updatedFiles,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const colorRes = await axios.get(
        "https://backenddatn-production.up.railway.app/v1/api/color/get_all_colors"
      );
      setColors(colorRes.data.metadata || []);

      try {
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

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/api/product/get_product_detail_update?_id=${productId}`
      );
      const product = response.data.metadata;

      const oldImages = (product.images_product || []).map((url) => ({
        file: null, // Không có file (chỉ lưu URL để giữ nguyên)
        preview: url,
      }));

      setProductData(product);
      setFormData({
        name_product: product.name_product || "",
        description: product.description || "",
        category_id: product.category_id || "",
        brand_id: product.brand_id || "",
        is_public: product.is_public || true,
        images: oldImages, // Gán ảnh cũ vào `formData`
        product_variants: product.product_variants || [],
      });

      setImagesPreview(oldImages); // Hiển thị ảnh cũ
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    setIsLoading1(true);
    e.preventDefault();
    let valid = true;
    const newErrors = {
      product_variants: "",
    };

    if (!formData.product_variants.length) {
      valid = false;
    } else {
      const seenVariants = new Set(); // Sử dụng Set để lưu các cặp giá trị duy nhất
      formData.product_variants.forEach((variant, index) => {
        if (!variant.quantity) {
          valid = false;
          newErrors[`product_variants[${index}].quantity`] =
            "Please enter the quantity.";
        }
        if (!variant.price) {
          valid = false;
          newErrors[`product_variants[${index}].price`] =
            "Please enter the price.";
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
        formData.product_variants.forEach((variant, index) => {
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

    if (!valid) {
      console.log("Errors:", newErrors);
      setErrors(newErrors); // Cập nhật lỗi cho từng trường
      setIsLoading1(false);
      return;
    }

    // Xóa lỗi nếu tất cả dữ liệu hợp lệ
    setErrors({}); // Reset lỗi

    const fd = new FormData();
    fd.append("name_product", formData.name_product);
    fd.append("description", formData.description);
    fd.append("category_id", formData.category_id);
    fd.append("brand_id", formData.brand_id);
    fd.append("is_public", formData.is_public);
    fd.append("product_variants", JSON.stringify(formData.product_variants));

    // Phân loại ảnh cũ và mới
    const oldImages = formData.images.filter((img) => !img.file); // Ảnh cũ (chỉ URL)
    const newImages = formData.images.filter((img) => img.file); // Ảnh mới (có file)

    // Gửi ảnh cũ qua trường old_images
    if (oldImages.length > 0) {
      fd.append(
        "old_images",
        JSON.stringify(oldImages.map((img) => img.preview))
      );
    }

    // Gửi ảnh mới qua trường images
    newImages.forEach((image) => {
      fd.append("images", image.file);
    });

    // Log form data entries để kiểm tra
    for (let [key, value] of fd.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await axios.post(
        `http://localhost:5000/v1/api/product/update_product?_id=${productData._id}`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleCloseModal();
      if (onProductUpdated) {
        onProductUpdated();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading1(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductData(null);
    setFormData({
      name_product: "",
      description: "",
      images: [],
      category_id: "",
      brand_id: "",
      product_variants: [],
      is_public: "true",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleVariantChange = (index, e) => {
  //   const { name, value, type, checked } = e.target;
  //   const updatedVariants = [...formData.product_variants];
  //   if (type === "checkbox") {
  //     updatedVariants[index][name] = checked;
  //   } else {
  //     updatedVariants[index][name] = value;
  //   }
  //   setFormData({
  //     ...formData,
  //     product_variants: updatedVariants,
  //   });
  // };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.product_variants];
    updatedVariants[index][field] = value; // Sử dụng trực tiếp field thay vì name
    setFormData({
      ...formData,
      product_variants: updatedVariants,
    });
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[`product_variants[${index}].${field}`];
      return updatedErrors;
    });
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      product_variants: [
        ...formData.product_variants,
        {
          quantity: "",
          price: "",
          size_id: "",
          image_product_color_id: "",
        },
      ],
    });
  };

  const handleNewVariantChange = (index, field, value) => {
    const newVariants = [...formData.product_variants];
    if (field === "quantity" || field === "price") {
      value = value === "" || value > 0 ? value : newVariants[index][field];
    }

    if (field === "image_product_color_id" && value === "last_added") {
      value = imageProductColors[imageProductColors.length - 1];
    }

    newVariants[index][field] = value;

    setFormData({
      ...formData,
      product_variants: newVariants,
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
      <button
        className="btn btn-primary"
        onClick={() => {
          fetchProductDetails();
        }}
      >
        <FontAwesomeIcon icon={faEdit} /> Edit
      </button>

      <Modal
        show={isModalOpen}
        onHide={handleCloseModal}
        size="lg"
        centered
        style={isModalVisible ? { opacity: 0.5 } : {}}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form onSubmit={handleUpdateProduct}>
              {/* Product Name */}
              <Form.Group controlId="name_product">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name_product"
                  value={formData.name_product}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {/* Description */}
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {/* Category */}
              <Form.Group controlId="category_id">
                <Form.Label>Category</Form.Label>
                <input
                  type="text"
                  value={
                    selectedCategoryToAdd
                      ? selectedCategoryToAdd.name_category
                      : "Select Category"
                  }
                  onClick={toggleModal}
                  readOnly
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    padding: "0.375rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </Form.Group>

              <Modal show={isModalVisible} onHide={toggleModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Select Category</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex" }}>
                  <div style={{ width: "33%" }}>
                    {/* Hiển thị danh mục cấp 1 */}
                    {categories.map((category) => (
                      <Button
                        key={category._id}
                        onClick={() => handleCategorySelect(category)}
                        style={{
                          color: "black",
                          ...styles.button,
                          ...(selectedCategory?._id === category._id
                            ? styles.activeItem
                            : {}),
                        }}
                      >
                        <span>{category.name_category}</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </Button>
                    ))}
                  </div>

                  {/* Hiển thị danh mục cấp 2 nếu có */}
                  {selectedCategory && (
                    <div style={{ width: "33%" }}>
                      {subCategories.map((subCategory) => (
                        <Button
                          key={subCategory._id}
                          onClick={() => handleSubCategorySelect(subCategory)}
                          style={{
                            color: "black",
                            ...styles.button,
                            ...(selectedSubCategory?._id === subCategory._id
                              ? styles.activeItem
                              : {}),
                          }}
                        >
                          <span>{subCategory.name_category}</span>
                          <FontAwesomeIcon icon={faChevronRight} />
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Hiển thị danh mục cấp 3 nếu có */}
                  {selectedSubCategory && (
                    <div style={{ width: "33%" }}>
                      {childCategories.map((childCategory) => (
                        <Button
                          key={childCategory._id}
                          onClick={() =>
                            setSelectedCategoryToAdd(childCategory)
                          }
                          style={{
                            color: "black",
                            ...styles.button,
                            ...(selectedCategoryToAdd?._id === childCategory._id
                              ? styles.activeItem
                              : {}),
                          }}
                        >
                          {childCategory.name_category}
                        </Button>
                      ))}
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

              {/* Brand */}
              <Form.Group controlId="brand_id">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  as="select"
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name_brand}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {/* Public Status */}
              <Form.Group controlId="is_public">
                <Form.Label>Is Public</Form.Label>
                <Form.Control
                  as="select"
                  name="is_public"
                  value={formData.is_public}
                  onChange={handleInputChange}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </Form.Control>
              </Form.Group>
              {/* Image Upload */}
              <Form.Group controlId="images">
                <Form.Label>Images</Form.Label>
                <div style={styles.imageGrid}>
                  {imagesPreview.map((image, index) => (
                    <div key={index} style={styles.imageContainer}>
                      <img
                        src={
                          image.preview.url ? image.preview.url : image.preview
                        }
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
                      onChange={handleFileChange}
                    />
                    <span style={styles.addIcon}>+</span>
                  </label>
                </div>
              </Form.Group>

              <div style={styles.formGroup}>
                <label style={styles.label}>Product Variants:</label>
                <div style={styles.variantContainer}>
                  {formData.product_variants.map((variant, index) => (
                    <div key={index}>
                      <label>Color:</label>
                      <div
                        style={{
                          background: "#EEEEEE",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        <Form.Group
                          style={{ display: "flex", alignItems: "center" }}
                          controlId={`variant_price_${index}`}
                        >
                          <div>
                            {variant.thumb_product_variant && (
                              <img
                                src={variant.thumb_product_variant}
                                alt="Price Thumbnail"
                                style={{
                                  width: "80px",
                                  height: "auto",
                                  borderRadius: "10px",
                                }}
                              />
                            )}
                          </div>
                          <Form.Label style={{ margin: "5px" }}>
                            {variant.name_color}
                          </Form.Label>
                        </Form.Group>
                        
                        <select
                          value={variant.image_product_color_id || ""} // Giá trị hiện tại
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedVariant =
                              formData.product_variants.find(
                                (variant) =>
                                  variant.image_product_color_id === selectedId
                              );
                            handleNewVariantChange(
                              index,
                              "image_product_color_id",
                              selectedId
                            );
                            if (selectedVariant) {
                              handleNewVariantChange(
                                index,
                                "name_color",
                                selectedVariant.name_color
                              );
                            }
                          }}
                          style={styles.select}
                        >
                          <option value="" disabled>
                            Select Image Color ID
                          </option>
                          {[
                            ...new Set(
                              formData.product_variants
                                .filter(
                                  (variant) => variant.image_product_color_id
                                )
                                .map((variant) =>
                                  variant.name_color
                                    ? `${variant.image_product_color_id} - ${variant.name_color}`
                                    : `${variant.image_product_color_id}`
                                )
                            ),
                          ].map((idWithName) => (
                            <option
                              key={idWithName}
                              value={idWithName.split(" - ")[0]}
                            >
                              {idWithName}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            handleNewVariantChange(
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

                      <label>Size:</label>
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

                      <label>Quantity:</label>
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

                      <label>Price:</label>
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

                      <Form.Check
                        style={{ marginTop: "10px" }}
                        type="checkbox"
                        label="Mark as Deleted"
                        name="is_delete"
                        checked={variant.is_delete || false}
                        onChange={(e) => handleVariantChange(index, e)}
                      />
                      <div>
                        {formData.product_variants.length >= 2 && (
                          <hr
                            style={{
                              border: "2px solid black",
                            }}
                          />
                        )}
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
                </div>
              </div>

              <hr />

              {/* Submit and Cancel */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="primary" type="submit" disabled={isLoading1}>
                  {isLoading1 ? <div className="spinner"></div> : "Update"}
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

const styles = {
  activeItem: {
    color: "red",
    backgroundColor: "white",
    border: "none",
  },
  button: {
    backgroundColor: "white",
    border: "none",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    textAlign: "left",
  },
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
  imagePreview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  removeButton: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    height: "100px",
    border: "1px dashed #ccc",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "24px",
    color: "#999",
  },
  inputFile: {
    display: "none",
  },
  addIcon: {
    fontSize: "24px",
    color: "#999",
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
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    marginTop: "10px",
  },
  buttonAddVariant: {
    backgroundColor: "#28a745",
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
  errorText: {
    color: "red",
    fontSize: "12px",
    textAlign: "center",
  },
};
