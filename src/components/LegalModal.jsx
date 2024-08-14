import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 600,
  maxHeight: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

const LegalModal = ({ open, handleClose, title, content }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box
          id="modal-modal-description"
          sx={{ mt: 2 }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <Button onClick={handleClose} sx={{ mt: 2 }}>
          닫기
        </Button>
      </Box>
    </Modal>
  );
};

export default LegalModal;
