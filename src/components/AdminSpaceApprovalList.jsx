import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Paper,
  Modal,
  Button,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import defaultImage from "../assets/default_house_pic.jpg";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const sidoOptions = [
  { display: "전체", value: "전체" },
  { display: "서울", value: "서울" },
  { display: "제주", value: "제주특별자치도" },
  { display: "부산", value: "부산" },
  { display: "인천", value: "인천" },
  { display: "대구", value: "대구" },
  { display: "대전", value: "대전" },
  { display: "광주", value: "광주" },
  { display: "울산", value: "울산" },
  { display: "세종", value: "세종특별자치시" },
  { display: "경기", value: "경기" },
  { display: "충북", value: "충북" },
  { display: "충남", value: "충남" },
  { display: "전북", value: "전북특별자치도" },
  { display: "전남", value: "전남" },
  { display: "경북", value: "경북" },
  { display: "경남", value: "경남" },
  { display: "강원", value: "강원특별자치도" },
];

const modifySido = (sido) => {
  const match = sidoOptions.find((item) => item.value === sido);
  return match ? match.display : null;
};

const AdminSpaceApprovalList = ({ spaces, onApprove, onReject }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
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
    setConfirmModalOpen(true);
  };

  const handleRejectClick = (spaceId) => {
    setSelectedSpaceId(spaceId);
    setConfirmAction("reject");
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
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
        <Typography variant="h6">승인 대기 중인 공간이 없습니다.</Typography>
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
                <Carousel sx={{ height: "100%" }} autoPlay={false}>
                  {space.imageUrlList && space.imageUrlList.length > 0 ? (
                    space.imageUrlList.map((imageUrl, index) => (
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
                    ))
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
                    {modifySido(space.sido)}
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
              <Typography variant="body2">{selectedSpace.content}</Typography>
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={confirmModalOpen}
        onClose={handleCloseConfirmModal}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="confirm-modal-title" variant="h6" component="h2">
            {confirmAction === "approve" ? "승인 확인" : "거절 확인"}
          </Typography>
          <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
            {confirmAction === "approve"
              ? "이 공간을 승인하시겠습니까?"
              : "이 공간을 거절하시겠습니까?"}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleCloseConfirmModal}
              sx={{
                mr: 1,
                backgroundColor: "#F17D7B",
                "&:hover": { backgroundColor: "#F05552" },
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirmAction}
              variant="contained"
              sx={{
                backgroundColor: "#87CEEB",
                "&:hover": { backgroundColor: "#2AAADE" },
              }}
            >
              확인
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminSpaceApprovalList;
