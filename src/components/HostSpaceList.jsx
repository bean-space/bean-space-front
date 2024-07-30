import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Paper,
  Modal,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import defaultImage from "../assets/default_house_pic.jpg";
import { useState } from "react";
import AirlineSeatIndividualSuiteTwoToneIcon from "@mui/icons-material/AirlineSeatIndividualSuiteTwoTone";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import DoNotTouchTwoToneIcon from "@mui/icons-material/DoNotTouchTwoTone";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const HostSpaceList = ({ spaces, onEdit, onDelete }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [value, setValue] = useState("ACTIVE");

  const handleOpenModal = (content) => {
    setSelectedContent(content);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const filteredSpaces = spaces.filter((space) => space.status === value);

  if (!spaces || spaces.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="h6">등록된 공간이 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          "& .Mui-selected": {
            color: "#2AAADE",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#2AAADE",
          },
        }}
      >
        <Tab
          icon={<AirlineSeatIndividualSuiteTwoToneIcon />}
          label="영업 중"
          value="ACTIVE"
        />
        <Tab
          icon={<HourglassBottomTwoToneIcon />}
          label="승인 대기중"
          value="PENDING"
        />
        <Tab
          icon={<DoNotTouchTwoToneIcon />}
          label="승인 거절"
          value="REJECTED"
        />
      </Tabs>
      <Grid container spacing={3}>
        {filteredSpaces.map((space) => (
          <Grid item key={space.id} xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ height: "25vh", overflow: "hidden" }}>
                <Carousel sx={{ height: "100%" }} autoPlay={false}>
                  {space.imageUrlList &&
                  space.imageUrlList.length > 0 &&
                  space.imageUrlList[0] != "" ? (
                    space.imageUrlList.map((imageUrl, index) => (
                      <Paper
                        className="mainImg"
                        key={index}
                        sx={{
                          height: "25vh",
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
                          alt="Default Image"
                        />
                      </Paper>
                    ))
                  ) : (
                    <Paper
                      className="defaultImg"
                      sx={{
                        height: "25vh",
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
                        alt="Default Image"
                      />
                    </Paper>
                  )}
                </Carousel>
              </Box>
              <CardContent>
                {space.status === "ACTIVE" ? (
                  <Link
                    to={`/space/${space.id}`}
                    style={{ textDecoration: "none" }}
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
                        lineHeight: "1.2em",
                        height: "2.4em",
                        color: "black",
                        cursor: "pointer",
                      }}
                    >
                      {space.listingName}
                    </Typography>
                  </Link>
                ) : (
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
                      lineHeight: "1.2em",
                      height: "2.4em",
                      color: "gray",
                    }}
                  >
                    {space.listingName}
                  </Typography>
                )}
                <Typography variant="body1" color="black" fontWeight="bold">
                  {space.price.toLocaleString()} 원/ 1박
                </Typography>
                <Typography variant="body2" color="text.primary">
                  추가 인원 금액: {space.pricePerPerson.toLocaleString()} 원/
                  1명
                </Typography>
                <Typography variant="body2" color="text.primary">
                  기준 인원: {space.defaultPeople} 명
                </Typography>
                <Typography variant="body2" color="text.primary">
                  최대 인원: {space.maxPeople} 명
                </Typography>
                <Typography variant="body2" color="text.primary">
                  우편번호: {space.zipCode}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  도로명 주소: {space.streetNameAddress}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  상세 주소: {space.detailedAddress}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  침실 개수: {space.bedRoomCount}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  침대 개수: {space.bedCount}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  욕실 개수: {space.bathRoomCount}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  onClick={() => handleOpenModal(space.content)}
                  sx={{
                    color: "black",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  상세 내용 보기
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign={"right"}
                >
                  {modifySido(space.sido)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(space.id)}
                    size="small"
                  >
                    수정
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(space.id)}
                    size="small"
                  >
                    삭제
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              상세 내용
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {selectedContent}
            </Typography>
          </Box>
        </Modal>
      </Grid>
    </Box>
  );
};

export default HostSpaceList;
