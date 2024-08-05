import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const MyReservationList = ({
  reservation,
  showReviewButton,
  isCompletedReservation,
}) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              noWrap
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "inherit",
                textDecoration: "none",
              }}
              component={Link}
              to={`/space/${reservation.spaceId}`}
            >
              {reservation.listingName}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            예약번호: {reservation.reservationId}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            이용 일시
          </Typography>
          <Typography variant="body2">
            체크인 날짜: {format(new Date(reservation.checkIn), "yyyy-MM-dd")}
          </Typography>
          <Typography variant="body2">
            체크아웃 날짜:{" "}
            {format(new Date(reservation.checkOut), "yyyy-MM-dd")}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            공간 상세 주소
          </Typography>
          <Typography variant="body2">
            우편 번호: {reservation.zipCode}
          </Typography>
          <Typography variant="body2">
            도로명 주소: {reservation.streetNameAddress}
          </Typography>
          <Typography variant="body2">
            상세 주소: {reservation.detailedAddress}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            이용 정보
          </Typography>
          <Typography variant="body2">
            인원: {reservation.reservationPeople}명
          </Typography>
          <Typography variant="body2">
            총 가격: {reservation.cost.toLocaleString()}원
          </Typography>
        </Box>

        {isCompletedReservation && (
          <Box sx={{ mt: "auto" }}>
            {showReviewButton ? (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/my-reservation/write-review/${reservation.spaceId}/${reservation.reservationId}`}
                sx={{
                  width: "100%",
                  fontSize: "1rem",
                  textShadow: "#000 0.7px 0.5px 2px",
                  backgroundColor: "#87CEEB",
                  "&:hover": { backgroundColor: "#2AAADE" },
                }}
              >
                리뷰 작성
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled
                sx={{
                  width: "100%",
                  fontSize: "1rem",
                  opacity: 0.7,
                  cursor: "default",
                  "&:hover": { backgroundColor: "#87CEEB" },
                }}
              >
                리뷰 작성 완료
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MyReservationList;
