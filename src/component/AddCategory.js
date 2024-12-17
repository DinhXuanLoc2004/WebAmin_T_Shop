import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddCategory = () => {
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
        setIsEditing(true);
      }
      setIsModalVisible(false);
    };
  
    const handleInputChange = (e) => {
      setEditedCategoryName(e.target.value);
    };
  
    return (
      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          {isEditing ? (
            <input
              type="text"
              value={editedCategoryName}
              onChange={handleInputChange}
              style={styles.input}
            />
          ) : (
            <Button variant="primary" onClick={toggleModal}>
              Add Category
            </Button>
          )}
        </div>
  
        <Modal show={isModalVisible} onHide={toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Select a category to add</Modal.Title>
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
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        style={{ marginRight: "5px" }}
                      />
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
                      <Button
                        variant="light"
                        block
                        onClick={() => handleSubCategorySelect(subCategory)}
                        style={{
                          backgroundColor: "white",
                          border: "none",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          ...(selectedSubCategory?._id === subCategory._id
                            ? styles.activeItem
                            : {}),
                        }}
                      >
                        {subCategory.name_category}
                        <FontAwesomeIcon icon={faChevronRight} />
                      </Button>
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
                        onClick={() => setSelectedCategoryToAdd(childCategory)}
                        style={{
                          backgroundColor: "white",
                          border: "none",
                          ...(selectedCategoryToAdd?._id === childCategory._id
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
    );
  };
  
  const styles = {
    container: {
      margin: "20px",
    },
    buttonContainer: {
      marginBottom: "20px",
    },
    input: {
      padding: "8px",
      fontSize: "16px",
      width: "100%",
    },
    menu: {
      width: "33%",
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
  };
  
  export default AddCategory;
  

