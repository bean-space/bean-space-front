import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import BannerImage from "../assets/coupon_banner.png";

const CouponBanner = () => {
  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box
        component={Link}
        to={"/coupon"}
        sx={{
          display: "block",
          width: "100%",
          maxWidth: "1890px",
          aspectRatio: "1890 / 340",
          margin: "16px auto",
          backgroundImage: `url(${BannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />
    </Container>
  );
};

export default CouponBanner;
