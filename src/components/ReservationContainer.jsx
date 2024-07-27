import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import defaulImage from "../assets/default_house_pic.jpg";
import Carousel from "react-material-ui-carousel";
import { getCouponListFromMember } from "../api/coupon";
import { useAuth } from "../hooks/useAuth";
import { reserveSpace } from "../api/reservation";

const ReservationPage = () => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [regularPrice, setRegularPrice] = useState(0);
  const [extraPersonCharge, setExtraPersonCharge] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const { space } = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const headCount = parseInt(searchParams.get("headCount"), 10);

  const calculatePrices = useCallback(
    (selectedCoupon = coupon) => {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

      const regularPrice = space.space.price * nights;
      setRegularPrice(regularPrice);

      const extraPeople = Math.max(0, headCount - space.space.defaultPeople);
      const extraCharge = extraPeople * space.space.pricePerPerson * nights;
      setExtraPersonCharge(extraCharge);

      let total = regularPrice + extraCharge;

      if (selectedCoupon) {
        const discount = Math.floor(
          Math.min(
            (total * selectedCoupon.discountRate) / 100,
            selectedCoupon.maxDiscount
          )
        );
        setDiscountAmount(discount);
        total -= discount;
      } else {
        setDiscountAmount(0);
      }

      setTotalPrice(Math.floor(total));
    },
    [space, checkIn, checkOut, headCount, coupon]
  );

  useEffect(() => {
    fetchCouponList();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(-1);
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (space) {
      calculatePrices();
    }
  }, [space, calculatePrices]);

  const handleCouponChange = (event) => {
    const selectedCouponId = event.target.value;
    const selectedCoupon = selectedCouponId
      ? availableCoupons.find((c) => c.userCouponId === selectedCouponId)
      : null;
    setCoupon(selectedCoupon);
    calculatePrices(selectedCoupon);
  };

  const fetchCouponList = async () => {
    const data = await getCouponListFromMember();
    const currentDate = new Date();
    const availableCoupons = data.filter(
      (coupon) => new Date(coupon.expirationAt) > currentDate && !coupon.usedAt
    );
    setAvailableCoupons(availableCoupons);
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    if (!isCouponValid()) {
      alert("쿠폰의 유효기간을 확인해주세요!");
      return;
    }

    try {
      const reservationInfo = {
        checkIn,
        checkOut,
        reservationPeople: headCount,
        ...(coupon ? { userCouponId: coupon.userCouponId } : {}),
      };

      const id = space.space.id;

      await reserveSpace({ reservationInfo, id });

      alert("예약에 성공했습니다!!");
      navigate("/myReservation");
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("예약에 실패하였습니다. 다시 시도해주세요");
      }
      return;
    }
  };

  const isCouponValid = () => {
    if (!coupon) return true;
    const currentDate = new Date();
    return new Date(coupon.expirationAt) > currentDate;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!space) return <div>로딩 중...</div>;

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, my: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#24368e",
            textAlign: "center",
            margin: "5px 0",
            padding: "10px",
            letterSpacing: "3px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
          gutterBottom
        >
          예약 확인
        </Typography>
        <Grid container spacing={3}>
          {/* 왼쪽 */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              예약할 숙소
            </Typography>
            <Typography variant="h6">{space.space.listingName}</Typography>
            <Carousel>
              {space.space.imageUrlList &&
              space.space.imageUrlList.length > 0 &&
              space.space.imageUrlList[0] !== "" ? (
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
                      alt="Space Image"
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
          </Grid>

          {/* 오른쪽 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderLeft: 1,
                borderColor: "divider",
                pl: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom>
                쿠폰 선택하기
              </Typography>
              {availableCoupons.length > 0 ? (
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>쿠폰 선택</InputLabel>
                  <Select
                    value={coupon ? coupon.userCouponId : ""}
                    onChange={handleCouponChange}
                    label="쿠폰 선택"
                  >
                    <MenuItem value="">선택 안함</MenuItem>
                    {availableCoupons.map((coupon) => (
                      <MenuItem
                        key={coupon.userCouponId}
                        value={coupon.userCouponId}
                      >
                        {coupon.name} ({coupon.discountRate}% 할인, 최대{" "}
                        {coupon.maxDiscount.toLocaleString()}원)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  사용 가능한 쿠폰이 없습니다.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                예약 정보
              </Typography>
              <Paper
                elevation={1}
                sx={{ p: 2, mb: 2, backgroundColor: "#d8f7fc" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">예약 인원:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {headCount}명
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">체크인:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {checkIn}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">체크아웃:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {checkOut}
                  </Typography>
                </Box>
              </Paper>
              <Box sx={{ flexGrow: 1 }} />

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                요금 세부정보
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">
                  기본 요금 (기준 {space.space.defaultPeople}인):
                </Typography>
                <Typography variant="body2">
                  ￦ {regularPrice.toLocaleString()}
                </Typography>
              </Box>
              {extraPersonCharge > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    추가 인원 요금 ({headCount - space.space.defaultPeople}명 x
                    ￦{space.space.pricePerPerson.toLocaleString()}/박):
                  </Typography>
                  <Typography variant="body2">
                    ￦ {extraPersonCharge.toLocaleString()}
                  </Typography>
                </Box>
              )}
              {discountAmount > 0 && coupon && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#e85a3c" }}>
                    쿠폰 할인 ({coupon.discountRate}% 할인, 최대 ￦
                    {coupon.maxDiscount.toLocaleString()}):
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e85a3c" }}>
                    - ￦ {discountAmount.toLocaleString()}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  총 요금:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  ￦ {totalPrice.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            sx={{
              fontSize: "1rem",
              borderColor: "#0399d8",
              color: "#0399d8",
              "&:hover": {
                backgroundColor: "#0399d8",
                borderColor: "#0399d8",
                color: "white",
              },
            }}
            onClick={handleGoBack}
          >
            이전 선택으로 돌아가기
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReservation}
            sx={{
              fontSize: "1rem",
              textShadow: "#000 0.7px 0.5px 2px",
              backgroundColor: "#87CEEB",
              "&:hover": { backgroundColor: "#2AAADE" },
            }}
          >
            예약하기
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReservationPage;
