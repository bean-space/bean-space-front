import { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { getHostReservationList } from "../api/host";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import InsertInvitationTwoToneIcon from "@mui/icons-material/InsertInvitationTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Link } from "react-router-dom";

const HostReservationContainer = () => {
  const [reservations, setReservations] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchHostReservations = async () => {
    setLoading(true);
    try {
      const data = await getHostReservationList();
      setReservations(data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("예약 목록을 가져올 수 없습니다");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostReservations();
  }, []);

  const filterReservations = () => {
    const now = new Date();

    const getCheckInDateTime = (date) => {
      const checkIn = new Date(date);
      checkIn.setHours(17, 0, 0, 0);
      return checkIn;
    };

    const getCheckOutDateTime = (date) => {
      const checkOut = new Date(date);
      checkOut.setHours(12, 0, 0, 0);
      return checkOut;
    };

    switch (tabValue) {
      case 0:
        return reservations.filter((reservation) => {
          const checkInTime = getCheckInDateTime(reservation.checkIn);
          const checkOutTime = getCheckOutDateTime(reservation.checkOut);
          return now >= checkInTime && now < checkOutTime;
        });
      case 1:
        return reservations.filter((reservation) => {
          const checkInTime = getCheckInDateTime(reservation.checkIn);
          return now < checkInTime;
        });
      case 2:
        return reservations.filter((reservation) => {
          const checkOutTime = getCheckOutDateTime(reservation.checkOut);
          return now >= checkOutTime;
        });
      default:
        return reservations;
    }
  };

  const filteredReservations = filterReservations();

  if (loading) {
    return (
      <Container>
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
    <Container>
      <Typography variant="h4" sx={{ marginY: 3 }}>
        호스트 예약 조회 페이지
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          "& .Mui-selected": {
            color: "#2AAADE",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#2AAADE",
          },
        }}
      >
        <Tab label="이용 중" icon={<HomeTwoToneIcon />} />
        <Tab label="임박한 예약" icon={<InsertInvitationTwoToneIcon />} />
        <Tab label="완료된 예약" icon={<CheckCircleTwoToneIcon />} />
      </Tabs>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <Grid item xs={12} sm={6} md={4} key={reservation.id}>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
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
                  <Typography>
                    체크인: {new Date(reservation.checkIn).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    체크아웃:{" "}
                    {new Date(reservation.checkOut).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    예약 인원: {reservation.reservationPeople}명
                  </Typography>
                  <Typography>
                    가격: {reservation.cost.toLocaleString()}원
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "150px",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                표시할 예약이 없습니다.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default HostReservationContainer;
