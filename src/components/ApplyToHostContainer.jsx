import { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Modal,
  Paper,
} from "@mui/material";
import { updateRoleToHost } from "../api/host";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ApplyToHostContainer = () => {
  const [open, setOpen] = useState(false);
  const { updateAuthState } = useAuth();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    try {
      const { accessToken } = await updateRoleToHost();
      await updateAuthState(accessToken);
      alert("호스트 신청이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("호스트 신청에 실패하였습니다");
      }
    }
    handleClose();
  };

  return (
    <Container maxWidth="md" sx={{ mb: 4, mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          호스트가 되어보세요!
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          여러분의 공간을 다른 사람들에게 공유해보세요! 여러분의 공간을 다른
          사람들이 채워줄 수 있어요!
        </Typography>
        <Typography variant="body1" paragraph>
          지금 바로 호스트가 되어보세요!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOpen}
          sx={{
            textShadow: "#000 0.7px 0.5px 2px",
            backgroundColor: "#87CEEB",
            "&:hover": { backgroundColor: "#2AAADE" },
          }}
        >
          호스트 신청하기
        </Button>
        <Typography variant="body2" paragraph sx={{ mt: 3 }}>
          호스트로 전환해도 일반 유저의 모든 기능(예약, 쿠폰 발급 및 사용)을
          사용할 수 있습니다.
        </Typography>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            호스트 전환 확인
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            호스트로 전환하시겠습니까?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              취소
            </Button>
            <Button variant="contained" onClick={handleConfirm}>
              확인
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default ApplyToHostContainer;
