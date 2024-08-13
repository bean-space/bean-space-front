import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Paper,
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import defaultImage from "../assets/default_house_pic.jpg";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const AdminSpaceApprovalList = ({ spaces, onApprove, onReject }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  const handleOpenModal = (content) => {
    setSelectedSpace(content);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleApproveClick = (spaceId) => {
    setSelectedSpaceId(spaceId);
    setConfirmAction("approve");
    setOpenConfirmDialog(true);
  };

  const handleRejectClick = (spaceId) => {
    setSelectedSpaceId(spaceId);
    setConfirmAction("reject");
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmDialog(false);
    setConfirmAction(null);
    setSelectedSpaceId(null);
  };

  const handleConfirmAction = () => {
    if (confirmAction === "approve") {
      onApprove(selectedSpaceId);
    } else if (confirmAction === "reject") {
      onReject(selectedSpaceId);
    }
    handleCloseConfirmModal();
  };

  if (!spaces || spaces.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="h6">표시할 공간이 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {spaces.map((space) => (
          <Grid item key={space.id} xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ height: "200px", overflow: "hidden" }}>
                <Carousel
                  sx={{ height: "100%" }}
                  autoPlay={false}
                  animation="slide"
                  indicators={true}
                  indicatorContainerProps={{
                    style: {
                      position: "absolute",
                      bottom: "20px",
                      zIndex: 1,
                      marginTop: 0,
                    },
                  }}
                >
                  {space.imageUrlList &&
                  space.imageUrlList.length > 0 &&
                  space.imageUrlList.some((url) => url.trim() !== "") ? (
                    space.imageUrlList.map(
                      (imageUrl, index) =>
                        imageUrl.trim() !== "" && (
                          <Paper
                            key={index}
                            sx={{
                              height: "200px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: `url(${imageUrl})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                              }}
                            />
                          </Paper>
                        )
                    )
                  ) : (
                    <Paper
                      sx={{
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${defaultImage})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      />
                    </Paper>
                  )}
                </Carousel>
              </Box>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      lineHeight: "1.5em",
                    }}
                  >
                    {space.listingName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"right"}
                  >
                    {space.sidoAndSigungu}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.primary">
                  가격: {space.price.toLocaleString()} 원 / 1박
                </Typography>
                <Typography variant="body2">
                  추가 인원당 가격: {space.pricePerPerson.toLocaleString()} 원
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  기준 인원: {space.defaultPeople}명 (최대 인원:{" "}
                  {space.maxPeople}명)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  침실 {space.bedRoomCount}개, 침대 {space.bedCount}개, 욕실{" "}
                  {space.bathRoomCount}개
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  onClick={() => handleOpenModal(space)}
                  sx={{
                    color: "primary.main",
                    textDecoration: "underline",
                    cursor: "pointer",
                    display: "block",
                    mt: 1,
                  }}
                >
                  상세 정보 보기
                </Typography>
                {space.status !== "REJECTED" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={() => handleApproveClick(space.id)}
                      size="small"
                      sx={{
                        fontSize: "0.8rem",
                        textShadow: "#000 0.7px 0.5px 2px",
                        backgroundColor: "#87CEEB",
                        "&:hover": { backgroundColor: "#2AAADE" },
                      }}
                    >
                      승인
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CancelOutlinedIcon />}
                      onClick={() => handleRejectClick(space.id)}
                      size="small"
                      sx={{
                        fontSize: "0.8rem",
                        backgroundColor: "#F17D7B",
                        textShadow: "0.5px 0.5px 0.5px #000",
                        color: "white",
                        "&:hover": { backgroundColor: "#F05552" },
                      }}
                    >
                      거절
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {selectedSpace && (
            <>
              <Typography variant="h6" component="h2" gutterBottom>
                상세 정보
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                전체 주소:
              </Typography>
              <Typography variant="body2">
                우편번호: {selectedSpace.zipCode}
              </Typography>
              <Typography variant="body2">
                도로명 주소: {selectedSpace.streetNameAddress}
              </Typography>
              <Typography variant="body2">
                상세 주소: {selectedSpace.detailedAddress}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                호스트 정보:
              </Typography>
              <Typography variant="body2">
                호스트 ID: {selectedSpace.hostId}
              </Typography>
              <Typography variant="body2">
                호스트 닉네임: {selectedSpace.hostNickname}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                숙소 설명:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {selectedSpace.content}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionProps={{ timeout: 0.3 }}
      >
        <DialogTitle id="alert-dialog-title">
          {confirmAction === "approve" ? "승인 확인" : "거절 확인"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmAction === "approve"
              ? "이 공간을 승인하시겠습니까?"
              : "이 공간을 거절하시겠습니까?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmModal}>취소</Button>
          <Button onClick={handleConfirmAction} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSpaceApprovalList;
