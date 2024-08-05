import {
  Typography,
  Grid,
  CardContent,
  Card,
  Tab,
  Tabs,
  Box,
  Container,
} from "@mui/material";
import { useState } from "react";
import LocalOfferTwoToneIcon from "@mui/icons-material/LocalOfferTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import TimerOffTwoToneIcon from "@mui/icons-material/TimerOffTwoTone";

const MyCouponList = ({ coupons }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterCoupons = () => {
    const now = new Date();
    switch (tabValue) {
      case 0:
        return coupons.filter(
          (coupon) => !coupon.usedAt && new Date(coupon.expirationAt) > now
        );
      case 1:
        return coupons.filter((coupon) => coupon.usedAt);
      case 2:
        return coupons.filter(
          (coupon) => new Date(coupon.expirationAt) <= now && !coupon.usedAt
        );
      default:
        return [];
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();

    return `${year}년 ${month}월 ${day}일 ${hour.toString().padStart(2, "0")}`;
  };

  const formatDateTimeForUsedCoupon = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const ampm = hour >= 12 ? "오후" : "오전";
    const hour12 = hour % 12 || 12;

    return `${year}년 ${month}월 ${day}일 ${ampm} ${hour12}시 ${minute}분 ${second}초`;
  };

  const filteredCoupons = filterCoupons();

  return (
    <Container maxWidth="md">
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          내 쿠폰 목록
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="coupon tabs"
          sx={{
            "& .Mui-selected": {
              color: "#2AAADE",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2AAADE",
            },
          }}
        >
          <Tab label="사용 가능" icon={<LocalOfferTwoToneIcon />} />
          <Tab label="사용 완료" icon={<CheckCircleTwoToneIcon />} />
          <Tab label="만료" icon={<TimerOffTwoToneIcon />} />
        </Tabs>
        {filteredCoupons.length > 0 ? (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {filteredCoupons.map((coupon) => (
              <Grid item xs={12} sm={6} key={coupon.userCouponId}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }} noWrap>
                      {coupon.name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {tabValue === 1
                        ? `사용 시간 : ${formatDateTimeForUsedCoupon(
                            coupon.usedAt
                          )}`
                        : `유효 기간 : ${formatDateTime(
                            coupon.expirationAt
                          )}시까지`}
                    </Typography>
                    <Typography variant="body2">
                      할인율: {coupon.discountRate}% (최대 {coupon.maxDiscount}
                      원)
                    </Typography>
                    <Typography variant="body2">
                      최대 할인 금액: {coupon.maxDiscount}원
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ mt: 7, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              표시할 쿠폰이 없습니다.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MyCouponList;
