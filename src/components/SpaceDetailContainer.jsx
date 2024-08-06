import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import defaulImage from "../assets/default_house_pic.jpg";
import {
  KingBed as KingBedIcon,
  Bathtub as BathtubIcon,
  MeetingRoom as MeetingRoomIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../assets/default_profile_image.webp";
import ReviewSection from "./ReviewSection";
import DateRangePickerForSpaceDetail from "./DateRangePickerForSpaceDetail";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import PeopleCountDropdownForSpaceDetail from "./PeopleCountDropdownForSpaceDetail";
import { useSearch } from "../hooks/useSearch";
import { useAuth } from "../hooks/useAuth";
import { deleteReview } from "../api/space";

const SpaceDetailContainer = ({
  space,
  reviews,
  setReviews,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchState, setSearchState } = useSearch();
  const { isLoggedIn } = useAuth();
  const { spaceId } = useParams();

  const [headCount, setHeadCount] = useState(searchState.peopleCount);
  const [dateRange, setDateRange] = useState({
    startDate: searchState.dateRange.startDate,
    endDate: searchState.dateRange.endDate,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteConfirmOpen(true);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const checkIn = queryParams.get("checkIn");
    const checkOut = queryParams.get("checkOut");
    const headCount = queryParams.get("headCount");

    if (checkIn && checkOut) {
      setDateRange({
        startDate: new Date(checkIn),
        endDate: new Date(checkOut),
      });
    }

    if (headCount) {
      setHeadCount(parseInt(headCount, 10));
    }
  }, [location.search]);

  const handleHeadCountChange = (newHeadCount) => {
    setHeadCount(newHeadCount);
    setSearchState((prev) => ({ ...prev, peopleCount: newHeadCount }));

    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("headCount", newHeadCount.toString());
    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    setSearchState((prev) => ({ ...prev, dateRange: newDateRange }));

    const formattedStartDate = format(newDateRange.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(newDateRange.endDate, "yyyy-MM-dd");

    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("checkIn", formattedStartDate);
    newSearchParams.set("checkOut", formattedEndDate);
    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  };

  const calculatePrices = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return { regularPrice: 0, extraPersonCharge: 0, totalPrice: 0 };
    }

    const nights = Math.ceil(
      (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)
    );

    const regularPrice = space.space.price * nights;

    const extraPersonCharge =
      Math.max(0, headCount - space.space.defaultPeople) *
      space.space.pricePerPerson *
      nights;

    const totalPrice = regularPrice + extraPersonCharge;

    return {
      regularPrice,
      extraPersonCharge,
      totalPrice,
    };
  };

  const { regularPrice, extraPersonCharge, totalPrice } = calculatePrices();

  const handleReservation = () => {
    if (!isLoggedIn) {
      alert("예약하려면 로그인이 필요합니다.");
      return;
    }

    const reservationParams = new URLSearchParams({
      spaceId: space.space.id,
      checkIn: format(dateRange.startDate, "yyyy-MM-dd"),
      checkOut: format(dateRange.endDate, "yyyy-MM-dd"),
      headCount: headCount.toString(),
    });

    navigate(`/reservation?${reservationParams.toString()}`, {
      state: { space },
    });
  };

  const handleEditReview = (review) => {
    navigate(`/edit-review/${spaceId}/${review.id}`, { state: { review } });
  };

  const confirmDeleteReview = async () => {
    if (reviewToDelete) {
      try {
        await deleteReview({ spaceId, reviewId: reviewToDelete });
        const updatedReviews = reviews.filter(
          (review) => review.id !== reviewToDelete
        );
        setReviews(updatedReviews);
        alert("리뷰가 삭제되었습니다");
      } catch (error) {
        if (error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("리뷰 삭제 중 오류가 발생했습니다");
        }
      }
    }
    setDeleteConfirmOpen(false);
    setReviewToDelete(null);
  };

  return (
    <div>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* 왼쪽 */}
          <Grid item xs={12} md={8}>
            <Carousel
              indicators={true}
              navButtonsAlwaysVisible={true}
              animation="slide"
              indicatorContainerProps={{
                style: {
                  position: "absolute",
                  bottom: "20px",
                  zIndex: 1,
                  marginTop: 0,
                },
              }}
            >
              {space.space.imageUrlList &&
              space.space.imageUrlList.length > 0 &&
              space.space.imageUrlList[0] != "" ? (
                space.space.imageUrlList.map((imageUrl, index) => (
                  <Paper
                    className="mainImg"
                    key={index}
                    sx={{
                      height: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      position: "relative",
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
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${defaulImage})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                    alt="Default Image"
                  />
                </Paper>
              )}
            </Carousel>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {space.space.listingName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {space.space.sido}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#87CEEB",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#4a4a4a",
                    marginRight: "8px",
                  }}
                >
                  평균 별점 :
                </Typography>
                <StarIcon sx={{ color: "#FFD700", mr: 0.5 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {space.averageRating
                    ? space.averageRating.toFixed(1)
                    : "아직 리뷰 없음"}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" alignItems="center" mb={3}>
              <IconButton>
                <Avatar
                  alt="defaul image"
                  src={space.host.profileImageUrl || defaultProfile}
                />
              </IconButton>
              <Typography variant="h6">
                호스트
                <span style={{ fontWeight: "bolder" }}>
                  &nbsp;{space.host.nickname}
                </span>
                님의 숙소
              </Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <MeetingRoomIcon />
                </ListItemIcon>
                <ListItemText primary={`침실 ${space.space.bedRoomCount}개`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <KingBedIcon />
                </ListItemIcon>
                <ListItemText primary={`침대 ${space.space.bedCount}개`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BathtubIcon />
                </ListItemIcon>
                <ListItemText primary={`욕실 ${space.space.bathRoomCount}개`} />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap" }}
              paragraph
            >
              {space.space.content}
            </Typography>
            <Divider sx={{ my: 3 }} />

            <ReviewSection
              reviews={reviews}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onEditReview={handleEditReview}
              onDeleteReview={handleDeleteReview}
            />
          </Grid>

          {/* 오른쪽 */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" component="span" gutterBottom>
                ￦ {space.space.price.toLocaleString()}
              </Typography>
              <Typography
                variant="subtitle1"
                component="span"
                sx={{
                  marginLeft: 0.5,
                  color: "text.secondary",
                  fontSize: "1em",
                }}
              >
                /박
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <DateRangePickerForSpaceDetail
                  initialCheckIn={dateRange.startDate}
                  initialCheckOut={dateRange.endDate}
                  reservedDateList={space.reservedDateList}
                  onDateRangeChange={handleDateRangeChange}
                />
                <Box sx={{ mt: 2 }}>
                  <PeopleCountDropdownForSpaceDetail
                    count={headCount}
                    setCount={handleHeadCountChange}
                    maxPeople={space.space.maxPeople}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    요금 세부정보
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">기본 요금:</Typography>
                    <Typography variant="body1">
                      ￦ {regularPrice.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">추가 인원 요금:</Typography>
                    <Typography variant="body1">
                      ￦ {extraPersonCharge.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      총 요금:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      ￦ {totalPrice.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#87CEEB",
                    "&:hover": { backgroundColor: "#2AAADE" },
                  }}
                  onClick={handleReservation}
                >
                  예약하기
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>리뷰 삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 리뷰를 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
          <Button onClick={confirmDeleteReview}>확인</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SpaceDetailContainer;
