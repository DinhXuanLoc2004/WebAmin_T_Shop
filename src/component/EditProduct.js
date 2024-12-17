import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EditProduct({ productId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [formData, setFormData] = useState({
    name_product: "",
    description: "",
    images: [],
    category_id: "",
    brand_id: "",
    product_variants: [],
    is_public: "false",
  });

  

  useEffect(() => {
    const fetchData = async () => {
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
      setProductData(response.data.metadata);
      setFormData({
        name_product: response.data.metadata.name_product || "",
        description: response.data.metadata.description || "",
        category_id: response.data.metadata.category_id || "",
        brand_id: response.data.metadata.brand_id || "",
        is_public: response.data.metadata.is_public || false,
        images: response.data.metadata.images_product || [],
        product_variants: response.data.metadata.product_variants || [],
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      product_variants: JSON.stringify(formData.product_variants),
    };

    try {
      await axios.post(
        `http://localhost:5000/v1/api/product/update_product?_id=${productData._id}`,
        updatedFormData
      );
      console.log(updatedFormData);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating product:", error);
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
      is_public: "false",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVariantChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedVariants = [...formData.product_variants];
    if (type === "checkbox") {
      updatedVariants[index][name] = checked;
    } else {
      updatedVariants[index][name] = value;
    }
    setFormData({
      ...formData,
      product_variants: updatedVariants,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData({
      ...formData,
      images: files,
    });
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

      <Modal show={isModalOpen} onHide={handleCloseModal} size="lg" centered>
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
                <Form.Control
                  type="text"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                />
              </Form.Group>

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
                <Form.Label>Upload Images</Form.Label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "block", marginBottom: "1rem" }}
                />
                {formData.images.length > 0 && (
                  <div>
                    <p>Selected Images:</p>
                    <ul>
                      {formData.images.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>

              {/* Product Variants */}
              <Form.Label>Product Variants</Form.Label>
              {formData.product_variants.map((variant, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                  <Form.Group controlId={`variant_price_${index}`}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={variant.price || ""}
                      onChange={(e) => handleVariantChange(index, e)}
                    />
                  </Form.Group>

                  <Form.Group controlId={`variant_quantity_${index}`}>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={variant.quantity || ""}
                      onChange={(e) => handleVariantChange(index, e)}
                    />
                  </Form.Group>

                  <Form.Group controlId={`variant_size_id_${index}`}>
                    <Form.Label>Size</Form.Label>
                    <Form.Control
                      as="select"
                      name="size_id"
                      value={variant.size_id || ""}
                      onChange={(e) => handleVariantChange(index, e)}
                    >
                      <option value="">Select a Size</option>
                      {sizes.map((size) => (
                        <option key={size._id} value={size._id}>
                          {size.size}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Check
                    type="checkbox"
                    label="Mark as Deleted"
                    name="is_delete"
                    checked={variant.is_delete || false}
                    onChange={(e) => handleVariantChange(index, e)}
                  />
                </div>
              ))}

              {/* Submit and Cancel */}
              <div className="mt-3">
                <Button variant="primary" type="submit">
                  Update
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
