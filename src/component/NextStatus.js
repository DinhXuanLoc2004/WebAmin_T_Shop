import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function NextStatus({ open, onClose, onConfirm }) {
  const style = {
    container: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#F2F4FC",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      height: "160px",
    },
    title: {
      size: "18px",
      color: "#0F61AC",
      fontWeight: "bold",
    },
    icon: {
      size: "18px",
      color: "#0F61AC",
    },
    description: {
      size: "16px",
      color: "black",
      marginLeft: "23px",
    },
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        style: { backgroundColor: "transparent" },
      }}
    >
      <Box style={style.container}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          <CheckCircleOutlineIcon style={style.icon} />
          <text style={style.title}>Delete</text>
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <text style={style.description}> Do you want to move to the next state?</text>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose}>No</Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}