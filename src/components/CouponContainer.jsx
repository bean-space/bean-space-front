import { useEffect, useState } from "react";
import { getCouponList, issueCoupon } from "../api/coupon";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
} from "@mui/material";
import CountdownTimer from "./CountdownTimer";

const CouponContainer = () => {
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    const data = await getCouponList();
    const sortedCoupons = sortCoupons(data);
    setCoupons(sortedCoupons);
  };

  const sortCoupons = (coupons) => {
    const now = new Date();
    return coupons.sort((a, b) => {
      const aStartTime = new Date(a.issueStartAt);
      const bStartTime = new Date(b.issueStartAt);
      const aEndTime = new Date(a.issueEndAt);
      const bEndTime = new Date(b.issueEndAt);

      const aAvailable = now >= aStartTime && now < aEndTime && a.stock > 0;
      const bAvailable = now >= bStartTime && now < bEndTime && b.stock > 0;

      const aUpcoming = now < aStartTime;
      const bUpcoming = now < bStartTime;

      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;
      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;

      return aStartTime - bStartTime;
    });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCouponButtonClick = async (id) => {
    try {
      await issueCoupon(id);
      alert("쿠폰 발급에 성공했습니다.");
      fetchCoupons();
    } catch (error) {
      if (error.response.data) {
        if (error.response.data.code == "401") {
          alert("쿠폰 발급을 위해 로그인을 해주세요.");
        } else {
          alert(error.response.data.msg);
        }
      } else {
        alert("쿠폰 발급에 실패했습니다.");
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}시`;
  };

  const getCouponDetailsBox = (coupon) => {
    const now = new Date();
    const startTime = new Date(coupon.issueStartAt);
    const endTime = new Date(coupon.issueEndAt);
    const isStarted = now >= startTime;
    const isEnded = endTime < now;
    const isOutofStock = coupon.stock == 0;

    return (
      <Box
        height={120}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="body1" align="center" gutterBottom>
            발급 마감 시간: {formatDateTime(coupon.issueEndAt)}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {isStarted && !isEnded && !isOutofStock
              ? `남은 수량: ${coupon.stock} / ${coupon.totalQuantity}`
              : !isStarted
              ? `총 발급 수량: ${coupon.totalQuantity}`
              : "\u00A0"}
          </Typography>
        </Box>
        {isEnded ? (
          <Button variant="contained" color="inherit" disabled size="large">
            발급 마감
          </Button>
        ) : isOutofStock ? (
          <Button variant="contained" color="inherit" disabled size="large">
            쿠폰 소진
          </Button>
        ) : !isStarted ? (
          <CountdownTimer targetDate={coupon.issueStartAt} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCouponButtonClick(coupon.id)}
            size="large"
            sx={{
              textShadow: "#000 0.7px 0.5px 2px",
              backgroundColor: "#87CEEB",
              "&:hover": { backgroundColor: "#2AAADE" },
            }}
          >
            발급 받기
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          mb={3}
        >
          쿠폰 이벤트 페이지
        </Typography>
        <Grid container spacing={3}>
          {coupons.map((coupon) => (
            <Grid item xs={12} sm={6} key={coupon.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {coupon.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    할인율: {coupon.discountRate}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    최대 할인 금액: {coupon.maxDiscount}원
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    쿠폰 만료 시간: {formatDateTime(coupon.expirationAt)}
                  </Typography>
                  <Box mt={2}>{getCouponDetailsBox(coupon)}</Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CouponContainer;
