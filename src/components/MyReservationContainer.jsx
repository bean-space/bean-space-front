import { useEffect, useState } from "react";
import {
  cancelReservation,
  getMemberReservationList,
} from "../api/reservation";
import MyReservationList from "./MyReservationList";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";

const MyReservationContainer = () => {
  const [reservations, setReservations] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

  const handleCancelReservation = (spaceId, reservationId) => {
    setReservationToCancel({ spaceId, reservationId });
    setOpenDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setReservationToCancel(null);
  };

  const fetchMyReservations = async () => {
    setLoading(true);
    try {
      const data = await getMemberReservationList();
      setReservations(data);
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("예약 목록을 불러올 수 없습니다");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterReservations = (reservations) => {
    const currentDate = new Date();

    return {
      upcomingReservation: reservations.filter((reservation) => {
        const checkInDate = new Date(reservation.checkIn);
        const checkOutDate = new Date(reservation.checkOut);
        return (
          !reservation.isCancelled &&
          (checkInDate > currentDate ||
            (currentDate >= checkInDate && currentDate <= checkOutDate) ||
            currentDate.toDateString() === checkOutDate.toDateString())
        );
      }),
      completedReservation: reservations.filter((reservation) => {
        const checkOutDate = new Date(reservation.checkOut);
        const checkOutDateNoon = new Date(checkOutDate.setHours(12, 0, 0, 0));
        return !reservation.isCancelled && currentDate > checkOutDateNoon;
      }),
      cancelledReservation: reservations.filter(
        (reservation) => reservation.isCancelled
      ),
    };
  };

  const handleDeleteConfirm = async () => {
    if (reservationToCancel) {
      try {
        await cancelReservation(reservationToCancel);
        alert("예약이 취소되었습니다.");
        fetchMyReservations();
      } catch (error) {
        if (error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("예약 취소 중 오류가 발생했습니다.");
        }
      }
    }
    setOpenDeleteDialog(false);
    setReservationToCancel(null);
  };

  const { upcomingReservation, completedReservation, cancelledReservation } =
    filterReservations(reservations);

  const renderEmptyMessage = () => (
    <Grid item xs={12}>
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          표시할 예약이 없습니다.
        </Typography>
      </Box>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress sx={{ color: "#87CEEB" }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="reservation tabs"
          sx={{
            "& .Mui-selected": {
              color: "#2AAADE",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2AAADE",
            },
          }}
        >
          <Tab
            label="이용 예정 및 이용중"
            icon={<CalendarMonthTwoToneIcon />}
          />
          <Tab label="완료된 예약" icon={<CheckCircleTwoToneIcon />} />
          <Tab label="취소한 예약" icon={<CancelTwoToneIcon />} />
        </Tabs>
      </Box>
      <Grid container spacing={2}>
        {tabValue === 0 &&
          (upcomingReservation.length > 0
            ? upcomingReservation.map((reservation) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={reservation.reservationId}
                >
                  <MyReservationList
                    reservation={reservation}
                    showReviewButton={false}
                    isCompletedReservation={false}
                    onCancelReservation={handleCancelReservation}
                  />
                </Grid>
              ))
            : renderEmptyMessage())}
        {tabValue === 1 &&
          (completedReservation.length > 0
            ? completedReservation.map((reservation) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={reservation.reservationId}
                >
                  <MyReservationList
                    reservation={reservation}
                    showReviewButton={!reservation.isReviewed}
                    isCompletedReservation={true}
                  />
                </Grid>
              ))
            : renderEmptyMessage())}
        {tabValue === 2 &&
          (cancelledReservation.length > 0
            ? cancelledReservation.map((reservation) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={reservation.reservationId}
                >
                  <MyReservationList
                    reservation={reservation}
                    showReviewButton={false}
                    isCompletedReservation={false}
                  />
                </Grid>
              ))
            : renderEmptyMessage())}
      </Grid>
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"예약 취소 확인"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말로 이 예약을 취소하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>취소</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyReservationContainer;
