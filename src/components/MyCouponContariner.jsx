import { useState, useEffect } from "react";
import MyCouponList from "./MyCouponList";
import { getCouponListFromMember } from "../api/coupon";
import { Box, CircularProgress, Container } from "@mui/material";

const MyCouponContainer = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCouponList = async () => {
    setLoading(true);
    try {
      const data = await getCouponListFromMember();
      setCoupons(data);
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("쿠폰 목록을 불러올 수 없습니다");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouponList();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
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

  return <MyCouponList coupons={coupons} />;
};

export default MyCouponContainer;
