import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import AdminCouponContainer from "../components/AdminCouponContainer";
import { getCouponList } from "../api/admin";
import { Box, CircularProgress } from "@mui/material";

const AdminCouponPage = () => {
  const { role, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();

  const getAdminCouponList = async () => {
    const data = await getCouponList();

    setCoupons(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      getAdminCouponList();
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || role !== "ADMIN")) {
      alert("관리자만 접근할 수 있는 페이지입니다.");
      navigate("/");
    }
  }, [isLoading, isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "ADMIN" || isLoading) {
    return (
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress sx={{ color: "#87CEEB" }} />
        </Box>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <AdminCouponContainer coupons={coupons} setCoupons={setCoupons} />
    </div>
  );
};

export default AdminCouponPage;
