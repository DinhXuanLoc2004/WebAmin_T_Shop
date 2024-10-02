import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const EditProduct = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <Grid container spacing={2} style={{ padding: "20px" }}>
      {/* Form Inputs */}
      <Grid item xs={12} md={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Edit Product</h2>

          {/* Name Field */}

          <text style={styles.title}>Name</text>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("name")}
          />

          {/* Price Field */}
          <div style={{ height: 25 }}></div>

          <text style={styles.title}>Price</text>

          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("price")}
          />

          {/* Quantity Field */}
          <div style={{ height: 25 }}></div>

          <text style={styles.title}>Quantity</text>

          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("quantity")}
          />

          {/* Category Field */}
          <div style={{ height: 25 }}></div>

          <text style={styles.title}>Category</text>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select {...register("category")} defaultValue="">
              <MenuItem value="short">Short</MenuItem>
              <MenuItem value="tee">Tee</MenuItem>
              <MenuItem value="hoodie">Hoodie</MenuItem>
              <MenuItem value="jacket">Jacket</MenuItem>
            </Select>
          </FormControl>

          {/* Brand Field */}
          <div style={{ height: 25 }}></div>

          <text style={styles.title}>Brand</text>

          <FormControl fullWidth margin="normal">
            <InputLabel>Brand</InputLabel>
            <Select {...register("brand")} defaultValue="">
              <MenuItem value="uniqlo">Uniqlo</MenuItem>
              <MenuItem value="gucci">Gucci</MenuItem>
              <MenuItem value="carhartt">Carhartt</MenuItem>
              <MenuItem value="stussy">Stussy</MenuItem>
            </Select>
          </FormControl>

          {/* Image Upload */}
          <div style={{ height: 25 }}></div>
          {/* <text style={styles.title}>Image</text> */}

          <Button
            variant="contained"
            component="label"
            fullWidth
            style={styles.uploadButton}
          >
            <span>Drop file</span> {/* Thay <text> bằng <span> */}
            <FontAwesomeIcon
              icon={faImage}
              style={{ marginLeft: 90, fontSize: 20 }}
            />{" "}
            {/* Thêm marginLeft để tạo khoảng cách */}
            <input type="file" hidden {...register("image")} />
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Submit
          </Button>
        </form>
      </Grid>

      {/* Product Image and Details */}
      <Grid item xs={12} md={6} mt={13}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://via.placeholder.com/300x400"
            alt="Product"
            style={{ width: "300px", height: "400px", objectFit: "cover" }}
          />
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "24px",
              }}
            >
              Longsleeve Violeta
            </p>
            <p style={{ color: "grey", marginBottom: "5px" }}>UNIQLO</p>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>$71.56</p>
            <p style={{ color: "grey", textDecoration: "line-through" }}>
              $87.6
            </p>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

const styles = {
  title: { fontSize: 18, color: "black" },
  uploadButton: {
    marginTop: 20,
    width: 240,
    height: 50,
    backgroundColor: "white",
    color: "#ABABAB",
    fontWeight: "bold",
    textTransform: "none",
    border: "2px solid #0048D9",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
};

export default EditProduct;
