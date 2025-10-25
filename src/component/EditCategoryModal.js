import React, { useState } from "react";

export default function EditCategoryModal({ isOpen, category, onUpdate, onRequestClose }) {
  const [name, setName] = useState(category?.name_category || "");
  const [image, setImage] = useState(category?.image_category || "");

  const handleUpdate = () => {
    const updatedData = {
      id_category: category._id,
      name_category: name,
      parent_id: category.parent_id,
      image,
    };
    onUpdate(updatedData); // Call the parent update function
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modal}>
      <h2>Chỉnh sửa danh mục</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên danh mục"
      />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="URL ảnh"
      />
      <button onClick={handleUpdate}>Cập nhật</button>
      <button onClick={onRequestClose}>Đóng</button>
    </div>
  );
}

const styles = {
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};
